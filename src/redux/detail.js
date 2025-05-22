// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: null,
    mobileNo: null,
    email: null,
    instagram: null,
    linkedIn: null,
    twitter: null
}

const detailsSlice = createSlice({
    name: 'detais',
    initialState,
    reducers:
    {
        setDetails: (state, action) => {
            const { username, mobileNo, instagram, linkedIn, twitter, email } = action.payload;

            if (username) state.username = username;
            if (mobileNo) state.mobileNo = mobileNo;
            if (email) state.email = email;
            if (instagram) state.instagram = instagram;
            if (linkedIn) state.linkedIn = linkedIn;
            if (twitter) state.twitter = twitter;
        }
    }
})

export const { setDetails } = detailsSlice.actions;
export default detailsSlice.reducer;