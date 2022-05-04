import React from 'react'
import { Checkbox } from './QuestionTypes/Checkbox';
import { Radio } from './QuestionTypes/Radio';
import { Input } from './QuestionTypes/Input';

export const Questions = ({ question }) => {
    switch (question.type) {
        case 'text':
            return (<Input
                question={question.question}

            />)
        case 'radio':
            return (<Radio
                question={question.question}
                choices={question.choices}
            />)
        case 'checkbox':
            return (<Checkbox
                question={question.question}
                choices={question.choices}
            />)

        default:
            return null;
    }
}
