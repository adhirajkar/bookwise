import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authStore = create((set) => ({
    user: null,
    token : null,
    isLoading: false,

    register: async (username, email, password ) =>{
        set({isLoading: true});
        try {
            const response = await fetch('http://localhost:5000/api/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password})
            })
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message || 'Something went wrong');
            }
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({user: data.user, token: data.token, isLoading: false});
            return {success: true, message: 'Registration successful'};
        } catch (error) {
            return {success: false, message: error.message};
        } finally {
            set({isLoading: false});
        }
    },
    login :async (email, password) =>{
        set({isLoading: true});
        try {
            const response = await fetch('http://localhost:5000/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message || 'Something went wrong');
            }
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({user: data.user, token: data.token, isLoading: false});
            return {success: true, message: 'Login successful'};
        }catch (error) {
            return {success: false, message: error.message};
        } finally {
            set({isLoading: false});
        }
    },
    checkAuth: async () =>{
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            console.log('Auth check', token, user);
            set({token, user});
        } catch (error) {
            console.log('Aurh check failed', error)
        }
    },
    logout: async () =>{
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            set({user: null, token: null});
        } catch (error) {
            console.log('Logout failed', error)
        }
    }
}))