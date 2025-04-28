import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style/index.css';
import Layout from './app/Layout';
import Home from './app/Home';
import History from './app/History';
import Login from './app/Login';
import Signup from './app/Signup';
import { AuthProvider } from './app/auth/AuthContext';
import ProtectedRoute from './app/auth/ProtectedRoute';
import AdminLocationPanel from './app/AdminLocation';
import UserManagement from './app/UserManagement';
import EditProfile from './app/Profile';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>} >
                        <Route path='' element={<Home />} />
                        <Route path='user-managment' element={<UserManagement />} />
                        <Route path='history' element={<History />} />
                        <Route path='profile' element={<EditProfile />} />
                        <Route path='*' element={<></>} />
                    </Route>
                </Routes>
            </BrowserRouter >
        </AuthProvider>
    )
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
