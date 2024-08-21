import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initialize state from localStorage or use default values
  const [password, setPassword] = useState(() => localStorage.getItem('currentPassword') || '');
  const [passwordStrength, setPasswordStrength] = useState(() => localStorage.getItem('passwordStrength') || 'Very Weak');
  const [length, setLength] = useState(() => parseInt(localStorage.getItem('length')) || 12);
  const [includeUpper, setIncludeUpper] = useState(() => JSON.parse(localStorage.getItem('includeUpper')) ?? true);
  const [includeLower, setIncludeLower] = useState(() => JSON.parse(localStorage.getItem('includeLower')) ?? true);
  const [includeNumbers, setIncludeNumbers] = useState(() => JSON.parse(localStorage.getItem('includeNumbers')) ?? true);
  const [includeSpecial, setIncludeSpecial] = useState(() => JSON.parse(localStorage.getItem('includeSpecial')) ?? true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(() => JSON.parse(localStorage.getItem('isPasswordVisible')) ?? false);
  const [passwords, setPasswords] = useState(() => JSON.parse(localStorage.getItem('passwords')) || []);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  // Save settings and generated passwords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('currentPassword', password);
    localStorage.setItem('passwordStrength', passwordStrength);
    localStorage.setItem('length', length);
    localStorage.setItem('includeUpper', JSON.stringify(includeUpper));
    localStorage.setItem('includeLower', JSON.stringify(includeLower));
    localStorage.setItem('includeNumbers', JSON.stringify(includeNumbers));
    localStorage.setItem('includeSpecial', JSON.stringify(includeSpecial));
    localStorage.setItem('isPasswordVisible', JSON.stringify(isPasswordVisible));
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }, [password, passwordStrength, length, includeUpper, includeLower, includeNumbers, includeSpecial, isPasswordVisible, passwords]);

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
        return 'Very Weak';
    }
  };

  // Function to generate unique passwords
  const generatePasswords = () => {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '1234567890';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?<>,./-=';

    let allChars = '';
    if (includeLower) allChars += lowerCase;
    if (includeUpper) allChars += upperCase;
    if (includeNumbers) allChars += numbers;
    if (includeSpecial) allChars += specialChars;

    if (allChars.length === 0) return; // Prevent generating a password with no characters

    const newPasswords = [];
    for (let i = 0; i < 5; i++) { // Generate 5 passwords
      let generatedPassword = '';
      for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        generatedPassword += allChars[randomIndex];
      }
      newPasswords.push(generatedPassword);
    }

    setPasswords(newPasswords);
    setPassword(newPasswords[0]);
    setPasswordStrength(calculateStrength(newPasswords[0]));
    setShowPasswordStrength(true);
  };

  // Function to copy the password to the clipboard
  const copyToClipboard = (password) => {
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
    <div className="app-container">
      <h1>Password Generator</h1>
      <div className="card">
        <label>
          Length:
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            min="4"
            max="20"
            aria-label="Password length"
          />
        </label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              aria-label="Include uppercase letters"
            />
            Include Uppercase
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              aria-label="Include lowercase letters"
            />
            Include Lowercase
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              aria-label="Include numbers"
            />
            Include Numbers
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeSpecial}
              onChange={(e) => setIncludeSpecial(e.target.checked)}
              aria-label="Include special characters"
            />
            Include Special Characters
          </label>
        </div>
        <button onClick={generatePasswords} aria-label="Generate passwords">
          Generate Passwords
        </button>
        {passwords.length > 0 && (
          <div className="password-container">
            {passwords.map((pwd, index) => (
              <div key={index} className="password-item">
                <p>
                  Password {index + 1}: 
                  <code>
                    {isPasswordVisible ? pwd : '*'.repeat(pwd.length)}
                  </code>
                  <button onClick={() => copyToClipboard(pwd)} aria-label={`Copy password ${index + 1} to clipboard`}>
                    Copy
                  </button>
                </p>
              </div>
            ))}
            {showPasswordStrength && (
              <>
                <p>Password Strength: <strong>{passwordStrength}</strong></p>
                <div className="strength-meter">
                  <div
                    className={`strength-meter-bar ${passwordStrength.toLowerCase()}`}
                    style={{ width: `${passwordStrength === 'Strong' ? 100 : passwordStrength === 'Medium' ? 66 : passwordStrength === 'Weak' ? 33 : 20}%` }}
                  ></div>
                </div>
              </>
            )}
            <button onClick={togglePasswordVisibility} className="eye-icon" aria-label="Toggle password visibility">
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

