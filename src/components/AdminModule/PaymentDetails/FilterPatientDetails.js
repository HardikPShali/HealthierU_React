import React, { useState, useRef, useEffect } from 'react';
import TuneIcon from '@material-ui/icons/Tune';
import IconButton from '@material-ui/core/IconButton';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import './filterPaymentDetails.css';

const FilterPatientDetails = (props) => {
    const ref = useRef();

    const [filter, setFilter] = useState(false);

    const [filterValues, setFilterValues] = useState({
        patientStartTime: '',
        patientEndTime: '',
    });

    const { patientStartTime, patientEndTime } = filterValues;

    const [endtimeChecked, setEndTimeChecked] = useState(false);

    const toggleFilterBox = () => {
        setFilter(filter ? false : true);
    };

    const handleCheckbox = (checked) => {
        if (checked === false) {
            setFilterValues({ ...filterValues, patientEndTime: '' });
            setEndTimeChecked(checked);
        } else {
            setEndTimeChecked(checked);
        }
    };

    const clearFilter = () => {
        setFilterValues({
            patientStartTime: '',
            patientEndTime: '',
        });
        props.updatedFilter({});
    };

    // useEffect(() => {
    //     props.updatedFilter(filterValues);
    //     console.log("filterValues", filterValues);
    // }, [filterValues])

    return (
        <div style={{ marginRight: '15px' }}>
            <IconButton
                onClick={() => toggleFilterBox()}
                style={{
                    backgroundColor: `${patientStartTime || patientEndTime || filter ? '#F6CEB4' : ''
                        }`,
                    color: `${patientStartTime || patientEndTime || filter === '' ? '#00d0cc' : ''}`,
                }}
            >
                <TuneIcon />
            </IconButton>
            {filter && (
                <div className="payment-details__filter-box" ref={ref}>
                    <ValidatorForm
                        onSubmit={() => {
                            props.updatedFilter(filterValues);
                            setFilter(false);
                        }}
                        onError={(error) => console.log(error)}
                    >
                        <div className="payment-details__filter-body">
                            <div className="row m-0">
                                <div className="col-md-12 col-xs-12">
                                    <p className='payment-details__appointment-startTime'>Appointment Date:</p>
                                    <div className="row">
                                        <div className="col-md-6 col-xs-6 pr-1">
                                            <TextField
                                                type="date"
                                                variant="filled"
                                                onChange={(e) =>
                                                    setFilterValues({
                                                        ...filterValues,
                                                        patientStartTime:
                                                            e.target.value === ''
                                                                ? ''
                                                                : new Date(e.target.value),
                                                    })
                                                }
                                                className="filterDate"
                                                // inputProps={{
                                                //     min: moment(new Date()).format('YYYY-MM-DD'),
                                                // }}
                                                value={moment(new Date(patientStartTime)).format(
                                                    'YYYY-MM-DD'
                                                )}
                                                onKeyDown={(e) => e.preventDefault()}
                                            />
                                        </div>
                                        <div className="col-md-6 col-xs-6 pl-1">
                                            <TextField
                                                type="date"
                                                variant="filled"
                                                onChange={(e) =>
                                                    setFilterValues({
                                                        ...filterValues,
                                                        patientEndTime:
                                                            e.target.value === ''
                                                                ? ''
                                                                : new Date(e.target.value),
                                                    })
                                                }
                                                className="filterDate"
                                                inputProps={{
                                                    min: moment(new Date(patientStartTime)).format(
                                                        'YYYY-MM-DD'
                                                    ),
                                                }}
                                                value={moment(new Date(patientEndTime)).format(
                                                    'YYYY-MM-DD'
                                                )}
                                                disabled={endtimeChecked ? false : true}
                                                onKeyDown={(e) => e.preventDefault()}
                                            />
                                        </div>
                                        <div className="col-md-12 col-xs-12">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={endtimeChecked}
                                                        disabled={patientStartTime ? false : true}
                                                        onChange={(e) => handleCheckbox(e.target.checked)}
                                                        name="checkedA"
                                                    />
                                                }
                                                label="Include End Date."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filter-action">
                            <div className="row m-0 mt-1">
                                <div className="col-md-12 col-12 button-wrapper-div">
                                    <button
                                        type="button"
                                        onClick={() => clearFilter()}
                                        className="btn btn-primary reset-btn ml-3 mb-2"
                                    >
                                        Clear All
                                    </button>
                                    <button type="submit" className="btn btn-primary apply-btn mr-3 mb-2">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ValidatorForm>
                </div>
            )}
        </div>
    );
};

export default FilterPatientDetails;
