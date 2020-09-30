import React, { useState } from 'react'
import { toast } from 'react-toastify';
import {connect} from 'react-redux'
import Button from '../components/buttons/button.component'
import Container from '../components/container/container.component'
import FormInput from '../components/inputs/form.input.component'
import {register} from '../data/reducers/auth'
import './loading.css'

const Register = ({register, isAuth, isLoading, user}) => {
  const [data, setData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  })

  const {name, email, password, confirmPassword} = data

  const handleChange = (name) => event => {
    setData({...data, [name]: event.target.value})
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if(password !== confirmPassword) {
      toast.success('Passwords do not match');
    } else if (!name || !email || !password) {
      toast.error('Please fill all fields');
    } else {
      register({name, email, password})
    }


  }

  return (
    <Container>
      <form 
        className='bg-white rounded-lg overflow-hidden shadow-2xl p-5 my-16
                    md:w-1/2 lg:w-1/3 mx-auto flex flex-col'
        onSubmit={onSubmit}>
        <h2 className='font-bold text-3xl text-center mb-5'>Register</h2>
          <FormInput 
            title='Name'
            placeholder='Congar'
            value={name}
            handleChange={handleChange('name')}
            type='text'
          />
          <FormInput 
            title='Email'
            placeholder='Congar@naver.com'
            value={email}
            handleChange={handleChange('email')}
            type='text'
          />
          <FormInput 
            title='Password'
            placeholder='********'
            value={password}
            handleChange={handleChange('password')}
            type='password'
          />
          <FormInput 
            title='Confirm Password'
            placeholder='********'
            value={confirmPassword}
            handleChange={handleChange('confirmPassword')}
            type='password'
          />
          {isLoading && <div id="loading" className='self-center mb-3'></div> }
          {!isLoading && <Button 
          title='SignUp'
          moreStyle='bg-primary text-white w-full mb-3'
          type='submit'/>}
          
          <div className='flex justify-end w-full'>
            <Button 
              isButton={false}
              title='already have an account ?'
              href='/login'
              moreStyle='text-gray-600'
            />
          </div>
      </form>
    </Container>
  )
}

const mapToStateProps = state => ({
  isAuth : state.auth.isAuthenticated,
  isLoading : state.auth.loading,
  user: state.auth.user
})
export default connect(mapToStateProps, {register})(Register);
