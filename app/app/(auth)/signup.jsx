import { KeyboardAvoidingView, Platform, View, Text, TextInput, ActivityIndicator, TouchableOpacity, Alert} from 'react-native'
import styles from '../../assets/styles/signup.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Link, useRouter } from "expo-router";
import  { useState } from 'react';
import { authStore } from '../../store/authStore';


const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const {isLoading, user, token, register} = authStore()
    const router = useRouter()
    async function handleSignup(){
        const res = await register(username, email, password)
        if(!res.success){
            Alert.alert(res.message)
        }
    }
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS=='ios'?'padding':'height'}>
        <View style={styles.container}>
            <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>BookWise 🧠</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputContainer}>
                    <Ionicons name='person-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput 
                        placeholder='Username' 
                        style={styles.input} 
                        placeholderTextColor={COLORS.placeholderText}
                        value={username}
                        onChangeText={setUsername}
                    />
                    </View>
                </View>
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                    <Ionicons name='mail-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput 
                        placeholder='Email' 
                        style={styles.input} 
                        placeholderTextColor={COLORS.placeholderText}
                        value={email}
                        onChangeText={setEmail}
                    />
                    </View>
                </View>
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name='lock-closed-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder='Enter your password'
                        keyboardType='default'
                        placeholderTextColor={COLORS.placeholderText}
                        secureTextEntry={!showPassword}
                    />
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.primary} style={styles.inputIcon} onPress={() => setShowPassword(!showPassword)} />
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
                {
                    isLoading?(
                        <ActivityIndicator size='small' color={COLORS.white} />
                    ):(
                        <Text style={styles.buttonText}>Register</Text>
                    )
                }

            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={()=>router.back()}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
            </View>
            </View>
            </View>
        </View>
    </KeyboardAvoidingView>
  )
}

export default Signup;