import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/AuthContext';
import { fetchWrapper } from '../../shared/utils/fetchWrapper';
import { Activity } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { loginAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLogin) {
        const res = await fetchWrapper.post('/auth/login', { username, password });
        loginAuth(res.token, res.user.role, res.user.username);
        navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        await fetchWrapper.post('/auth/register', { username, password, role: 'user' }); // Default register as user
        setIsLogin(true);
        setErrorMsg('Registration successful! Please login.');
      }
    } catch (err) {
      setErrorMsg(err.toString());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="card-surface w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-light p-3 rounded-full text-white shadow-lg">
            <Activity size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800 dark:text-white">
          Lapor Mang
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </p>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary text-lg mt-4">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            className="text-secondary hover:text-secondary-dark font-medium transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
