import {getQuestionnaires} from "../QuestionnaireService";

it('Questionnaire Length Check', async () => {

    const response = await getQuestionnaires();
    //console.log(response)
    expect(response.length).toEqual(2);
});


it('Questionnaire ID should not be null', async () => {

    const response = await getQuestionnaires();

    for (var i = 0; i < response.length; i++) {
        expect(response[i].id).not.toBeNull();
    }
});

it('Questionnaire ID should be Integer', async () => {

    const response = await getQuestionnaires();

    for (var i = 0; i < response.length; i++) {
        expect(isNumber(response[i].id)).toBeTruthy();
    }
});





it('Question should not be empty', async () => {

    const response = await getQuestionnaires();

    for (var i = 0; i < response.length; i++) {
        expect(response[i].question).not.toBeNull();
    }
});


const isNumber = value => typeof value === 'number' && value === value && value !== Infinity && value !== -Infinity
