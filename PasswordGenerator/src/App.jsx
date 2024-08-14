import { useState } from 'react';
import './App.css';

function App() {
  // State to hold the generated password, its strength, and visibility
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to determine password strength
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    switch (strength) {
      case 5:
        return 'Strong';
      case 4:
        return 'Medium';
      case 3:
        return 'Weak';
      case 2:
        return 'Very Weak';
      default:
        return '';
    }
  };

  // Function to generate a unique password
  const generatePassword = () => {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '123456789';
    const specialChars = '!@#$%^*()_+~`|}{[]:;?<>,./-='

    let allChars = ''
    if (includeLower) allChars += lowerCase;
    if (includeUpper) allChars += upperCase;
    if (includeNumbers) allChars += numbers;
    if (includeSpecial) allChars += specialChars;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      generatedPassword += allChars[randomIndex];
    }

    setPassword(generatedPassword);
    setPasswordStrength(calculateStrength(generatedPassword));
  };

  // Function to copy the password to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      alert('Password copied to clipboard!');
    }, () => {
      alert('Failed to copy password.');
    });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <h1>Password Generator</h1>
      <div className="card">
        <label>
          Length:
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            min="4"
            max="20"
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
          />
          Include Uppercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeLower}
            onChange={(e) => setIncludeLower(e.target.checked)}
          />
          Include Lowercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          Include Numbers
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeSpecial}
            onChange={(e) => setIncludeSpecial(e.target.checked)}
          />
          Include Special Characters
        </label>
        <button onClick={generatePassword}>
          Generate Password
        </button>
        <div className="password-container">
          <p>
            Generated Password: 
            <code>
              {isPasswordVisible ? password : '*'.repeat(password.length)}
            </code>
            <button onClick={togglePasswordVisibility} className="eye-icon">
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </button>
          </p>
        </div>
        {password && (
          <>
            <p>Password Strength: <strong>{passwordStrength}</strong></p>
            <div className="strength-meter">
              <div
                className={`strength-meter-bar ${passwordStrength.toLowerCase()}`}
                style={{ width: `${(passwordStrength === 'Strong' ? 100 : passwordStrength === 'Medium' ? 66 : passwordStrength === 'Weak' ? 33 : 20)}%` }}
              ></div>
            </div>
            <button onClick={copyToClipboard}>
              Copy to Clipboard
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
