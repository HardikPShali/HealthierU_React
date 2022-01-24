import { shallow } from 'enzyme';
import React from 'react';
import Questionnaire from "../Questionnaire";
import { configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<Questionnaire />', () => {

    it("should render my component", () => {
        const component  = shallow(
            <Questionnaire/>
        );

        expect(component.getElements()).toMatchSnapshot();
    });

});