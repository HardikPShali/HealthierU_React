import React, { useState, useEffect } from 'react';
import {
    getAvailableCouponsByPatientId,
    verifyCouponSelectedBypatient,
} from '../../../service/frontendapiservices';
import { toast } from 'react-toastify';
import './PromoCodeForPatient.css';

const PromoCodeForPatient = ({
    promoCodeData,
    onPromoCodeChange
}) => {
    // Promocode Logics
    const { doctorId, patientId, apptMode, rate, halfRate } = promoCodeData

    const [promoCodeEnteredText, setPromoCodeEnteredText] = useState('');
    const [couponsFromApi, setCouponsFromApi] = useState([]);

    const handlePromoEnteredText = (e) => {
        setPromoCodeEnteredText(e.target.value);
        if (e.target.value === '') {
            onPromoCodeChange(false);
            onPromoCodeChange({
                discountApplied: rate || halfRate,
                couponId: 0,
                promoCodeTextEntered: '',
            })
        }
    };

    const getAvailableCoupons = async () => {
        const patientIdForPromoCode = patientId;
        const couponResponse = await getAvailableCouponsByPatientId(
            patientIdForPromoCode,
            window.ptoken
        ).catch((err) => console.log({ err }));

        const couponDetailsFromRes = couponResponse?.data?.data?.map((couponDets) => {
            return couponDets;
        });

        console.log({ couponDetailsFromRes });
        setCouponsFromApi(couponDetailsFromRes);
    };

    const discountCalculationHandler = (discount, apptMode) => {
        if (apptMode === 'Follow Up') {
            return (halfRate * (1 - discount)).toFixed(2);
        } else if (apptMode === 'First Consultation') {
            return (rate * (1 - discount)).toFixed(2);
        } else {
            return discount;
        }
    };

    const applyPromoCodeHandler = async (apptMode) => {
        console.log({ token: window.ptoken })
        const textEntered = promoCodeEnteredText;
        const coupons = couponsFromApi;

        const couponExtractedFromEnteredPromoCode = coupons?.find((coupon) => {
            return coupon.couponDetails.couponCode === textEntered;
        });

        console.log({ couponExtractedFromEnteredPromoCode });

        const couponId = couponExtractedFromEnteredPromoCode?.couponDetails.id;
        const patientIdForPromoCode = patientId;
        const doctorIdForPromoCode = doctorId

        const data = {
            couponId: couponId,
            patientId: patientIdForPromoCode,
            doctorId: doctorIdForPromoCode,
        };

        const verifyResponse = await verifyCouponSelectedBypatient(data, window.ptoken).catch(
            (err) => {
                console.log({ err });
                if (
                    err.response.status === 500 &&
                    err.response.data.message ===
                    'Coupon not applicable for selected Doctor'
                ) {
                    toast.error(err.response.data.message, {
                        hideProgressBar: true,
                        autoClose: 2000,
                        toastId: 'promoInvalid'
                    });
                    onPromoCodeChange(false);
                }
                else if (err.response.status === 401) {
                    toast.error(err.response.data.error_description, {
                        hideProgressBar: true,
                        autoClose: 2000,
                        toastId: 'promoInvalid'
                    });
                    onPromoCodeChange(false);
                }
                else {
                    toast.error('Invalid Promo Code. Please try again.', {
                        hideProgressBar: true,
                        autoClose: 2000,
                        toastId: 'promoInvalid'
                    });
                    onPromoCodeChange(false);
                }
            }
        );
        // console.log({ verifyResponse })

        if (verifyResponse?.data.status === true) {
            const discountOffered =
                couponExtractedFromEnteredPromoCode?.couponDetails.offer;
            const discountCalculated = discountCalculationHandler(
                discountOffered,
                apptMode
            );
            onPromoCodeChange({
                discountApplied: discountCalculated,
                couponId: couponId,
                promoCodeTextEntered: textEntered,
            });
            // setDiscountApplied(discountCalculated);
            toast.success('Promo Code Applied Successfully', {
                toastId: 'promoCodeSuccess',
                hideProgressBar: true,
                autoClose: 1000,
            });
        }
    };

    useEffect(() => {
        window.ptoken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJwYXRpZW50YWN0aXZhdGlvbmNoZWNrIiwic2NvcGUiOlsib3BlbmlkIl0sImV4cCI6MTY2MDExNDc3NiwiaWF0IjoxNjYwMDI4Mzc2LCJhdXRob3JpdGllcyI6WyJST0xFX1BBVElFTlQiXSwianRpIjoiZmY5OTFmZmUtMjBkZi00NWZjLTg5NzQtMTdjYzM5ZTExODA0IiwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.azOi-n5pjp-tbB52Sji1LNk0nIWM7NMm_-vV-oRf1mAcN59I41WQXBFLhCbFx7ostjaJ4UpVbHTBWBRo5mzJwRYt3mscaQtwCKVCVDEUz8EgwC4Nd5-YOg80JtXpaN7H6ufgjCSkpoM-g02M4pwd0TPOBI02YP3j7A4rVBeFTrkQ8XXQNtamWSc3iLvpXd-YFssWDlikr7ZJ-73ANgbFWrmI6gdNVwiJVWRuv8ls5u0DAZWWrfr5eaoNP0k3JoDMFHJQY8l9PdJoijtgLT4d2Ikft724W0Mo80mgyUIdfm78pEbXxwmn4qq3J9vpHnUvOjufiLIsoYPhxelaITQTTw'
        getAvailableCoupons();
    }, []);

    return (
        <div className="promo-code-listing">
            <input
                id="standard-basic"
                type="text"
                name="promoCodeEnteredText"
                onChange={(e) => handlePromoEnteredText(e)}
                placeholder="Enter Promo Code"
                value={promoCodeEnteredText}
                className="promo-code-input"
            />
            <button
                className="btn promo-code-button"
                onClick={() => {
                    applyPromoCodeHandler(apptMode);
                }}
            >
                Apply Promo Code
            </button>
        </div>
    );
};

export default PromoCodeForPatient;
