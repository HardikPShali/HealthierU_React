import React, { useState, useRef, useEffect } from 'react';
import TuneIcon from '@material-ui/icons/Tune';
import IconButton from '@material-ui/core/IconButton';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// const useOutsideAlerter = (ref, onOutsideClick) => {
//     useEffect(() => {
//         /**
//          * Alert if clicked on outside of element
//          */
//         const handleClickOutside = (event) => {
//             if (ref.current && !ref.current.contains(event.target)) {
//                 console.log("You clicked outside of me!");
//                 onOutsideClick();
//             }
//         }
//         // Bind the event listener
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             // Unbind the event listener on clean up
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [ref]);
// }

const FilterComponent = (props) => {
    const ref = useRef();

    // useOutsideAlerter(ref, () => {
    //     setFilter(false);
    // })

    const [filter, setFilter] = useState(false);

    const [filterValues, setFilterValues] = useState({
        patientSlot: '',
        patientStartTime: '',
        patientEndTime: '',
    });

    const { patientSlot, patientStartTime, patientEndTime } = filterValues;

    const [endtimeChecked, setEndTimeChecked] = useState(false);

    const toggleFilterBox = () => {
        setFilter(filter ? false : true);
    };

    const handleAppoitnmentType = (e) => {
        if (e.target.value === 'First Consultation') {
            console.log('CONSULTATION| selected', e.target.value);
            setFilterValues({
                ...filterValues,
                patientSlot: e.target.value,
            });
        } else if (e.target.value === 'Follow Up') {
            console.log('FOLLOW UP| selected', e.target.value);
            setFilterValues({
                ...filterValues,
                patientSlot: e.target.value,
            });
        } else if (e.target.value === '') {
            // setAppointmentSlot([]);
        }
        //   setDisable({ ...disable, continue: true });
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
                <div className="appointment-filter-box" ref={ref}>
                    <ValidatorForm
                        onSubmit={() => {
                            props.updatedFilter(filterValues);
                            setFilter(false);
                        }}
                        onError={(error) => console.log(error)}
                    >
                        <div className="appointment-filter-body">
                            <div className="row m-0">
                                <div className="col-md-12 col-xs-12">
                                    <p>Appointment Date:</p>
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
                                {/* <div className="col-md-12 col-xs-12 pr-1">
                                    <p>Consultation Type:</p>
                                    <FormControl>
                                        <Select
                                            id="demo-controlled-open-select"
                                            variant="filled"
                                            name="appointmentType"
                                            value={patientSlot}
                                            displayEmpty
                                            onChange={(e) => handleAppoitnmentType(e)}
                                        >

                                            <MenuItem value="CONSULTATION">
                                                Consultation(1 Hr)
                                            </MenuItem>
                                            <MenuItem value="Follow Up">
                                                Follow up(30 Mins)
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div> */}
                            </div>
                        </div>
                        <div className="filter-action">
                            <div className="row m-0 mt-1">
                                <div className="col-md-6 col-6">
                                    <button
                                        type="button"
                                        onClick={() => clearFilter()}
                                        className="btn btn-primary reset-btn"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="col-md-6 col-6">
                                    <button type="submit" className="btn btn-primary apply-btn">
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

export default FilterComponent;
