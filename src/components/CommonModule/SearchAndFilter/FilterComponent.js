import React, { useState, useRef } from 'react';
import TuneIcon from '@material-ui/icons/Tune';
import IconButton from '@material-ui/core/IconButton';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';

const FilterComponent = () => {
    const ref = useRef();

    const [filter, setFilter] = useState('');

    const [filterValues, setFilterValues] = useState({
        patientId: '',
        patientName: '',
        patientStartTime: '',
        patientEndTime: '',
    });

    const {
        patientId,
        patientName,
        patientStartTime,
        patientEndTime,
    } = filterValues;

    const [endtimeChecked, setEndTimeChecked] = useState(false);

    const toggleFilterBox = () => {
        setFilter(filter ? false : true);
    };

    const handleInput = (e) => {
        // console.log('name is', e.target.value);
        setFilterValues({ ...filterValues, [e.target.value]: e.target.value });
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
            patientId: '',
            patientName: '',
            patientStartTime: '',
            patientEndTime: '',
        });
    };

    return (
        <div>
            <IconButton
                onClick={() => toggleFilterBox()}
                style={{
                    backgroundColor: `${patientId || patientName || patientStartTime || patientEndTime
                        ? '#F6CEB4'
                        : ''
                        }`,
                    color: `${patientId || patientName || patientStartTime || patientEndTime
                        ? '#00d0cc'
                        : ''
                        }`,
                }}
            >
                <TuneIcon />
            </IconButton>
            {filter && (
                <div className="appointment-filter-box" ref={ref}>
                    <ValidatorForm
                        // onSubmit={() => handleFilter()}
                        onError={(error) => console.log(error)}
                    >
                        <div className="appointment-filter-body">
                            <div className="row m-0">
                                {/* <div className="col-md-12 col-xs-12 pr-1">
                                    <p>Patient ID:</p>
                                    <TextField
                                        type="text"
                                        variant="filled"
                                        className="appointment-filter-input"
                                        placeholder="Patient ID"
                                        onChange={(value) => handleInput(value)}
                                        value={setFilterValues.patientId}
                                    />
                                </div>
                                <div className="col-md-12 col-xs-12 pr-1">
                                    <p>Patient Name:</p>
                                    <TextField
                                        type="text"
                                        variant="filled"
                                        className="appointment-filter-input"
                                        placeholder="Patient Name"
                                        onChange={(value) => handleInput(value)}
                                        value={setFilterValues.patientName}
                                    />
                                </div> */}
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
                                                        patientStartTime: e.target.value === '' ? '' : new Date(e.target.value),
                                                    })
                                                }
                                                className="filterDate"
                                                inputProps={{
                                                    min: moment(new Date()).format('YYYY-MM-DD'),
                                                }}
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
                                                        patientEndTime: e.target.value === '' ? '' : new Date(e.target.value),
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
