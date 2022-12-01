import { render } from 'react-dom';
import renderer from 'react-test-renderer';

import Registration from '../registration';
import Schedule from '../schedule'


// x.toJSON --> is snapshot
// Gets checked by expect(x).toMatchSnapshot
//We should make sure registration is registration


it('Logs in when all entries are valid', () => {
    const component = renderer.create(<Registration></Registration>)
let registrationRender = component.toJSON();
expect(registrationRender).toMatchSnapshot();

//Then take picture of Schedule


//Then login successfully and expect it to match snapshot
//Currently struggling with finding a way to pass in useRef values during the test,
//^^looking at jest.fn & mock, rpc (for supabase)
//but this test might need to be written with react testing library
//renderer.act(() => {registrationRender.props.})
renderer.act(() => {registrationRender.props.signUp()})
})