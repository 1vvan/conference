import React, { useEffect, useState } from 'react';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { Link } from "react-router-dom";
import { collectionRef } from '../../Firebase';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import twitterConfig from '../../config/config-twitter';

const Main = () => {
    // For First Form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthdate, setBirthdate] = useState(""); // eslint-disable-line no-unused-vars
    const [selectedDate, setSelectedDate] = useState(null);
    const [subject, setSubject] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    // For Second Form
    const [countries, setCountries] = useState([]);
    const [image, setImage] = useState("");

    // For Show/Hide Blocks
    const [showFirstForm, setShowFirstForm] = useState(true);
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [showThirdBlock, setShowThirdBlock] = useState(false);

    // For number of conference members
    const [count, setCount] = useState(0);

    // Display the number of conference members   
    useEffect(() => {
        const db = getFirestore();
        const membersCollection = collection(db, "members");
        const getCount = async () => {
            const querySnapshot = await getDocs(membersCollection);
            setCount(querySnapshot.size);
        };
        getCount();
    }, []);

    // Max Date for Datepicker
    const maxDate = new Date();
    maxDate.setMonth(11);
    maxDate.setDate(31);
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    
    // Form Validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!firstName) {
            newErrors.firstName = "Please enter your first name";
            isValid = false;
        }

        if (!lastName) {
            newErrors.lastName = "Please enter your last name";
            isValid = false;
        }

        if (!selectedDate) {
            newErrors.birthdate = "Please enter your birthdate";
            isValid = false;
        }

        if (!subject) {
            newErrors.subject = "Please enter your report subject";
            isValid = false;
        }

        if (!country) {
            newErrors.country = "Please select your country";
            isValid = false;
        }

        if (!phone) {
            newErrors.phone = "Please enter your phone number";
            isValid = false;
        }

        if (!email) {
            newErrors.email = "Please enter your email address";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    
    // Delete Error When Entering
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        if (errors.firstName && event.target.value) {
            const newErrors = { ...errors };
            delete newErrors.firstName;
            setErrors(newErrors);
        }
    };
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        if (errors.lastName && event.target.value) {
            const newErrors = { ...errors };
            delete newErrors.lastName;
            setErrors(newErrors);
        }
    };
    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
        if (errors.subject && event.target.value) {
            const newErrors = { ...errors };
            delete newErrors.subject;
            setErrors(newErrors);
        }
    };
    const handleCountryChange = (event) => {
        setCountry(event.target.value);
        if (errors.country && event.target.value) {
            const newErrors = { ...errors };
            delete newErrors.country;
            setErrors(newErrors);
        }
    };
    const handlePhoneChange = (value) => {
        setPhone(value);
        if (errors.phone && value) {
            const newErrors = { ...errors };
            delete newErrors.phone;
            setErrors(newErrors);
        }
    };
    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (errors.email && newEmail) {
            const newErrors = { ...errors };
            delete newErrors.email;
            setErrors(newErrors);
        }
        // check email for correctness
        if (newEmail && !isValidEmail(newEmail)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Invalid email. Please enter the correct email.',
            }));
        }
    };

    // Countries API
    useEffect(() => {
        fetch('https://restcountries.com/v2/all')
            .then(response => response.json())
            .then(data => setCountries(data))
            .catch(error => console.error(error));
    }, []);
    
    // Email Validate
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Preview Photo
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
        }
    }


    const { twitter } = twitterConfig;
    const handleTwitterClick = () => {
        const shareLink = `${twitter.shareUrl}?text=${encodeURIComponent(twitter.shareText)}`;
        window.open(shareLink);
    }

    const shareLinkGmail = `mailto:?subject=${encodeURIComponent('Check out this Meetup with SoCal!')}&body=${encodeURIComponent('Reference link to the conference: https://conference-registration-steel.vercel.app/')}`;
    const handleGmailClick = () => {
        window.open(shareLinkGmail);
    };

    const shareLinkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://conference-registration-steel.vercel.app/')}&quote=${encodeURIComponent('Check out this Meetup with SoCal!')}`;
    const handleFacebookClick = () => {
    window.open(shareLinkFacebook);
  };
    
    
// Forms Handles Submit
const handleSubmitFirstForm = (event) => {
    event.preventDefault();
    if (validateForm()) {
        setShowFirstForm(!showFirstForm);
        setShowSecondForm(!showSecondForm);
    }
}
    
const handleSubmitSecondForm = (event) => {
    event.preventDefault();
    if (validateForm()) {
        const member = {
            firstName: firstName,
            lastName: lastName,
            birthdate: format(selectedDate, "dd.MM.yyyy"),
            subject: subject,
            country: country,
            phone: phone,
            email: email,
            companyName: event.target.companyName.value,
            companyPosition: event.target.companyPosition.value,
            about: event.target.about.value,
            photo: image,
  };

  // Save data Firebase
  collectionRef
    .add(member)
    .then(() => {
        console.log("The data is successfully saved in Firebase");
        // Cleaning the form
        setFirstName("");
        setLastName("");
        setBirthdate("");
        setSubject("");
        setCountry("");
        setPhone("");
        setEmail("");
        setSelectedDate(null);
        event.target.reset();
        setImage(null);
    })
    .catch((error) => {
        console.error("An error while maintaining data in Firebase: ", error);
    });
        setShowSecondForm(!showSecondForm);
        setShowThirdBlock(!showThirdBlock);
    }
};   
    
    return (
        <div className='wrapper'>
            <main className='main'>
                <div className="main_map map">
                    <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.761723296044!2d-118.3458722847837!3d34.10124408059264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf20e4c82873%3A0x14015754d926dadb!2s7060%20Hollywood%20Blvd%2C%20Los%20Angeles%2C%20CA%2090028%2C%20USA!5e0!3m2!1sen!2sua!4v1678476925310!5m2!1sen!2sua"
                    title='map' width="100%" height="450" style={{border:0}} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
                </div>
                <form action="#" className={showFirstForm ? 'container' : 'hide'} onSubmit={handleSubmitFirstForm}>
                    <div className="row" style={{ marginBottom: 20 }}>
                        <div className="col-md-12 d-flex justify-content-center">
                            <h5 style={{fontSize:30}}>To participate in the conference, please fill out the form</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <Link to="/members" className='link-to-members-list'>
                                <p>Total conference members: {count}</p>
                            </Link>
                        </div>
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="firstName" className="form-label">First Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={handleFirstNameChange}
                        />
                        {errors.firstName && (
                            <span className="text-danger label-error">{errors.firstName}</span>
                        )}
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="lastName" className="form-label">Last Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={handleLastNameChange}
                        />
                        {errors.lastName && (
                            <span className="text-danger label-error">{errors.lastName}</span>
                        )}
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="birthdate" className="form-label">Birthdate <span className="text-danger">*</span></label>
                        <DatePicker
                            className="form-control"
                            id="birthdate"
                            name="birthdate"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={selectedDate}
                            onChange={(date, event) => {
                                setBirthdate(event.target.value);
                                setSelectedDate(date);
                                if (errors.birthdate && date) {
                                    const newErrors = { ...errors };
                                    delete newErrors.birthdate;
                                    setErrors(newErrors);
                                }
                            }}
                            autoComplete="off" 
                            maxDate={maxDate}
                            dateFormat="dd.MM.yyyy"
                            placeholderText="MM.DD.YYYY"
                        />
                        {errors.birthdate && (
                            <span className="text-danger label-error">{errors.birthdate}</span>
                        )}
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="subject" className="form-label">Report Subject <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            value={subject}
                            onChange={handleSubjectChange}
                        />
                        {errors.subject && (
                            <span className="text-danger label-error">{errors.subject}</span>
                        )}
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="country" className="form-label">Country <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            id="country"
                            name="country"
                            value={country}
                            onChange={handleCountryChange}
                        >
                            <option>Select country</option>
                            {countries.map(country => (
                                <option key={country.alpha2Code} value={country.name}>
                                {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && (
                            <span className="text-danger label-error">{errors.country}</span>
                        )}
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="phone" className="form-label">Phone Number <span className="text-danger">*</span></label>
                        <PhoneInput
                            className="form-control"
                            id="phone" name="phone"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={handlePhoneChange}
                            countrySelectProps={{
                            className: "form-select"
                        }}
                        />
                        {errors.phone && (
                            <span className="text-danger label-error">{errors.phone}</span>
                        )}
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="email" className="form-label">Email Address <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {errors.email && (
                            <span className="text-danger label-error">{errors.email}</span>
                        )}
                    </div>
                    
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <button type="submit" className="btn btn-success mt-4" style={{ width: "20%" }}>Next</button>
                        </div>
                    </div>
                </form>
                <form action="#" className={showSecondForm ? 'container' : 'hide'} onSubmit={handleSubmitSecondForm}>
                    <div className="form-group mt-2">
                        <label htmlFor="companyName" className="form-label">Company Name</label>
                        <input type="text" className="form-control" id="companyName" name="companyName" />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="companyPosition" className="form-label">Company Position</label>
                        <input type="text" className="form-control" id="companyPosition" name="companyPosition" />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="about" className="form-label">About Me</label>
                        <input type="text" className="form-control" id="about" name="about" />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="photo" className="form-label">Photo</label>
                        <input
                            type="file"
                            className="form-control"
                            id="photo"
                            name="photo"
                            onChange={handleImageUpload}
                        />
                        {image && (
                            <img
                                src={image}
                                alt=""
                                style={{ maxWidth: "200px", marginTop: "20px", }}
                            />
                        )}
                    </div>
                    <button type="submit" className="btn btn-success mt-4" style={{ width: "100%" }}>Next</button>
                </form>

                <div className={showThirdBlock ? 'container' : 'hide'}>
                    <div className="row" style={{marginBottom:50}}>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className='link-button' onClick={handleFacebookClick}><img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="" /></button>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className='link-button' onClick={handleTwitterClick}><img src="https://cdn-icons-png.flaticon.com/512/145/145812.png" alt="" /></button>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className='link-button' onClick={handleGmailClick}><img src="https://cdn-icons-png.flaticon.com/512/5968/5968534.png" alt="" /></button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <Link to="/members">
                                <button type="submit" className="btn btn-success mb-4" style={{width:"100%"}}>Go to Members List</button>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default Main;
