// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: null,
    mobileNo: null,
    instagram: null,
    linkedIn: null,
    twitter: null
}

const detailsSlice = createSlice({
    name: 'detais',
    initialState,
    reducers: 
    {
    setDetails:  (state,action) => {
        const {username,mobileNo,instagram,linkedIn,twitter} = action.payload;
        state.username = username;
        state.mobileNo = mobileNo;
        state.instagram = instagram;
        state.linkedIn = linkedIn;
        state.twitter = twitter;


        console.log(state.username);
        console.log(state.mobileNo);
    }
}
})

export const {setDetails} = detailsSlice.actions;
export default detailsSlice.reducer;