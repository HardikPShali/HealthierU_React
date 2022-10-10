import React, { useState, useEffect } from 'react';
import {
    getAvailableCouponsByPatientId,
    verifyCouponSelectedBypatient,
} from '../../../service/frontendapiservices';
import { toast } from 'react-toastify';
import './PromoCodeForPatient.css';
import CancelIcon from '@material-ui/icons/Cancel';
import { faLaptopHouse, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

const PromoCodeForPatient = ({
    promoCodeData,
    onPromoCodeChange,
    onPromoCodeLoading = () => { },
    mobile = false
}) => {
    // Promocode Logics
    const { doctorId, patientId, apptMode, rate, halfRate } = promoCodeData

    const [promoCodeEnteredText, setPromoCodeEnteredText] = useState('');
    const [couponsFromApi, setCouponsFromApi] = useState([]);
    const [appliedText, setAppliedText] = useState('');
    const [errorText, setErrorText] = useState('');
    const [disableInput, setDisableInput] = useState(false);

    const [loading, setLoading] = useState(false);

    const handlePromoEnteredText = (e) => {
        console.log('handlePromoEnteredText', e.target.value);
        setErrorText('');
        setPromoCodeEnteredText(e.target.value);
        if (e.target.value === '') {
            onPromoCodeChange(false);
            onPromoCodeChange({
                discountApplied: rate || halfRate,
                couponId: 0,
                promoCodeTextEntered: '',
                promoCodeAdded: false,
            })
            setAppliedText('');
            setErrorText('');
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

        console.log("RESPONSE FROM AVAILABLE COUPONS API", JSON.stringify(couponDetailsFromRes));
        setCouponsFromApi(couponDetailsFromRes);
    };

    const discountCalculationHandler = (discount, apptMode) => {
        if (apptMode === 'Follow Up' || apptMode === 'FOLLOW_UP') {
            return (halfRate * (1 - discount)).toFixed(2);
        } else if (apptMode === 'First Consultation' || apptMode === 'FIRST_CONSULTATION') {
            return (rate * (1 - discount)).toFixed(2);
        } else {
            return discount;
        }
    };

    const applyPromoCodeHandler = async (e, apptMode) => {
        setLoading(true);
        setErrorText('');
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

        onPromoCodeLoading(true);

        const verifyResponse = await verifyCouponSelectedBypatient(data, window.ptoken).catch(
            (err) => {
                onPromoCodeLoading(false);
                console.log("ERROR CAUGHT FROM VERIFY COUPON API", JSON.stringify(err));
                if (
                    err.response.status === 500 &&
                    err.response.data.message ===
                    'Coupon not applicable for selected Doctor'
                ) {
                    setErrorText(err.response.data.message);
                    setLoading(false);
                    onPromoCodeChange(false);
                    onPromoCodeLoading(false);
                }
                else if (err.response.status === 401) {
                    setLoading(false);
                    setErrorText(err.response.data.error_description);
                    onPromoCodeChange(false);
                    onPromoCodeLoading(false);
                }
                else {
                    setLoading(false);
                    setErrorText('Invalid Promo Code. Please try again.');
                    onPromoCodeChange(false);
                    onPromoCodeLoading(false);
                }
            }
        );
        console.log('RESPONSE FROM VERIFY COUPON API', JSON.stringify(verifyResponse))

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
                promoCodeAdded: true
            });
            setDisableInput(true);
            setErrorText('');
            setAppliedText(`${textEntered} offer applied on bill`);
            setLoading(false);
        }
    };

    const clearPromoCodeInput = () => {
        onPromoCodeLoading(false);
        if (mobile === true) {
            window.location.reload();
        }
        setPromoCodeEnteredText('');
        onPromoCodeChange(false);
        setAppliedText('');
        setErrorText('');
        setDisableInput(false);
        onPromoCodeChange({
            discountApplied: 0,
            couponId: 0,
            promoCodeTextEntered: '',
            promoCodeAdded: false,
        });
    }

    useEffect(() => {
        if (!mobile) {
            getAvailableCoupons();
        }
        // getAvailableCoupons();
    }, []);

    useEffect(() => {
        // console.log("INSIDE 2ND USE EFFECT");
        if (window.ptoken) {
            getAvailableCoupons();
        }
        // getAvailableCoupons();
    }, [window.ptoken]);

    return (
        <>
            <div className="promo-code-listing">
                <div className='promo-code-input-field'>
                    <input
                        type="text"
                        name="promoCodeEnteredText"
                        onChange={(e) => handlePromoEnteredText(e)}
                        placeholder="Enter Promo Code"
                        value={promoCodeEnteredText}
                        className="promo-code-input"
                        autoComplete='off'
                        disabled={disableInput}
                        onPaste={(e) => {
                            console.log('onPaste', e.target.value);
                            handlePromoEnteredText(e);
                        }}
                    />
                    {
                        disableInput === true && (
                            <span onClick={clearPromoCodeInput} className='promo-code-cancel'>
                                <CancelIcon />
                            </span>
                        )
                    }

                </div>

                <button
                    className="btn promo-code-button"
                    onClick={(e) => {
                        applyPromoCodeHandler(e, apptMode);
                    }}
                >
                    Apply Promo Code
                </button>

            </div>
            {
                appliedText && (
                    <div className="promo-code-applied-text">{appliedText}</div>
                )
            }
            {
                errorText && (
                    <div className="promo-code-error-text">{errorText}</div>
                )
            }
            {
                loading && (
                    <div className="promo-code-loading">Applying Promo Code...</div>
                )
            }
        </>
    );
};

export default PromoCodeForPatient;
