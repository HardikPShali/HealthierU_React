import axios from 'axios';
import {getToken} from "./TokenService";
jest.mock('axios');

// Make sure to resolve with a promise
axios.mockResolvedValue();

it('fetchData', async () => {

    axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {foo: 'bar'} }));

    await expect(getToken).not.toBeNull();


});
