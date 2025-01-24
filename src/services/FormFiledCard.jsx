import { Button, Uploader } from "rsuite";
import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import "rsuite/dist/rsuite.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';


// date picker module
function DatePickerModule() {
    const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
  );
}

// country selector module
function CountrySelector() {
    const [value, setValue] = useState('')
    const options = useMemo(() => countryList().getData(), [])
  
    const changeHandler = value => {
      setValue(value)
    }
  
    return <Select placeholder={'Select Country...'} options={options} value={value} onChange={changeHandler} />
}

export default function FormFieldCard() {
    return (
        <div>
            <div className="fieldset-legend">
            Other...

            {/* uploader */}
            <Uploader
                listType="picture-text"
                action="//jsonplaceholder.typicode.com/posts/"
                className="pt-2"
            >
                <Button>Select files...</Button>
            </Uploader>
            </div>


            <div className="mt-2 w-50 pr-5">
                {CountrySelector()}
            </div>
            <div className="mt-2 w-50 pr-5">
                {DatePickerModule()}
            </div>
        </div>
    )
}