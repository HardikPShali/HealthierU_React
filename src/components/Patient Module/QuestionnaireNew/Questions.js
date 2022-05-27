import React from 'react';
import { Checkbox } from './QuestionTypes/Checkbox';
import { Radio } from './QuestionTypes/Radio';
import { Input } from './QuestionTypes/Input';

export const Questions = ({ question, followQuestion }) => {
    if (question.hidden === true) return null;

    switch (question.type) {
        case 'text':
            return <Input followQuestion={followQuestion} question={question} />;

        case 'radio':
            return <Radio followQuestion={followQuestion} question={question} />;

        case 'checkbox':
            return <Checkbox followQuestion={followQuestion} question={question} />;

        default:
            return null;
    }
};
