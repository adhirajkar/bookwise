import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import  { useState } from'react'
import styles from '../../assets/styles/login.styles'
import {Ionicons} from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Link } from "expo-router";
import { authStore } from '../../store/authStore'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const {isLoading, login} = authStore();

    async function handleLogin(){
        const res = await login(email, password)
        if(!res.success){
            Alert.alert(res.message)
        }
    }
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS=='ios'?'padding':'height'}>
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image resizeMode='contain' source={require('../../assets/images/i1.png')} style={styles.illustrationImage} />
      </View>
      <View style={styles.card}>
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name='mail-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Enter your email'
                        keyboardType='email-address'
                        placeholderTextColor={COLORS.placeholderText}
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
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {
                    isLoading?(
                        <ActivityIndicator size='small' color={COLORS.white} />
                    ):(
                        <Text style={styles.buttonText}>Login</Text>
                    )
                }

            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href='/signup' asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>Sign Up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>

      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default Login;