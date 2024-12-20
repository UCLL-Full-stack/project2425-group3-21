import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import UserService from '../../services/UserService';

type Props = {
  onSubmit: (data: any) => void;
};

const RegisterForm: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = t('register.nameRequired');
    if (!email.trim()) newErrors.email = t('register.emailRequired');
    if (!password.trim()) newErrors.password = t('register.passwordRequired');
    if (!role.trim()) newErrors.role = t('register.roleRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const user = { name, email, password, role };
        const response = await UserService.createUser(user);
        if (response.ok) {
          const userPayload = await response.json();
          const userthing = userPayload.response;

          try {
            const user = { email, password };
            const response = await UserService.loginUser(user);
        
            if (response.status === 200) {
              const userPayload = await response.json();
              const userthing = userPayload.response;
        
        
              console.log("User logged in:", userPayload);
              sessionStorage.setItem("loggedInUser", JSON.stringify({
                token: userthing.token,
                role: userthing.role,
                userId: userthing.userId,
              }));
        
              setTimeout(() => {
                router.push("/");
              }, 2000);
            } else {
            }
          } catch (error) {
            console.error("Login error:", error);
          }


          setTimeout(() => {
            router.push("/");
          }, 500);

          onSubmit(userPayload);
        } else {
          setErrors({ form: t('register.error') });
        }
      } catch (error) {
        console.log(error);
        setErrors({ form: t('register.error') });
      }
    }
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('register.label.name')}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>
      <div>
        <label>{t('register.label.email')}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>
      <div>
        <label>{t('register.label.password')}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>
      <div>
        <label>{t('register.label.role')}</label>
        <input className="form-input" type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        {errors.role && <p className="error-text">{errors.role}</p>}
      </div>
      <br />
      {errors.form && <p className="error-text">{errors.form}</p>}
      <button className="btn-primary" type="submit">{t('register.button')}</button>
    </form>
  );
};

export default RegisterForm;