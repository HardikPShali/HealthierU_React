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
        }
    };

    const getAvailableCoupons = async () => {
        const patientIdForPromoCode = patientId;
        const couponResponse = await getAvailableCouponsByPatientId(
            patientIdForPromoCode
        ).catch((err) => console.log({ err }));

        const couponDetailsFromRes = couponResponse.data.data?.map((couponDets) => {
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
        const textEntered = promoCodeEnteredText;
        const coupons = couponsFromApi;

        const couponExtractedFromEnteredPromoCode = coupons.find((coupon) => {
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

        const verifyResponse = await verifyCouponSelectedBypatient(data).catch(
            (err) => {
                console.log({ err });
                if (
                    err.response.status === 500 &&
                    err.response.data.message ===
                    'Coupon not applicable for selected Doctor'
                ) {
                    toast.error(err.response.data.message);
                    onPromoCodeChange(false);
                } else {
                    toast.error('Invalid Promo Code. Please try again.');
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
            });
        }
    };

    useEffect(() => {
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
