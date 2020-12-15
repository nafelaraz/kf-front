import React, {useReducer, useState} from 'react';
import './App.css';
import axios from 'axios';

const formReducer = (state, event) => {
    if (event.reset) {
        return {
            identificationNumber: '',
            name: '',
            surname: '',
            income: '',
            phoneNumber: '',
        }
    }

    return {
        ...state,
        [event.name]: event.value
    }
}

function App() {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);
    const [showRes, setShowRes] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [message, setMessage] = useState("");

    const [data, setData] = useState({
        identificationNumber: '',
        name: '',
        surname: '',
        limit: ''
    });

    const handleSubmit = event => {
        console.log(formData)
        event.preventDefault();
        setSubmitting(true);
        axios.post(`http://localhost:8081/loanlimit/calculate`, formData)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.result == "BULUNAMADI") {
                    setMessage("Girmiş olduğunuz kimlik numarasına ait bir kredi notu bulunamamıştır. Kimlik numarasını kontrol edip tekrar deneyiniz.");
                    setConfirmed(false);
                } else if (res.data.result === "ERROR") {
                    setMessage("Sistemlerimizde bir hata oluşmuştur. Lütfen daha sonra tekrar deneyiniz.");
                    setConfirmed(false);
                } else {
                    setConfirmed(true);
                    setMessage(res.data.result);
                    setData({
                            identificationNumber: res.data.identificationNumber,
                            name: res.data.name,
                            surname: res.data.surname,
                            limit: res.data.limit
                        }
                    )
                }
            })
        setShowRes(true);

        setTimeout(() => {
            setSubmitting(false);
            setFormData({
                reset: true
            })
        }, 3000);
    }
    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }
    return (
        <div className="wrapper">
            <h1>K.F. Kredi Başvuru</h1>
            <p> Kredi Limitinizi Öğrenmek İçin Lütfen Formu Doldurunuz</p>
            {submitting &&
            <div>
                You are submitting the following:
                <ul>
                    {Object.entries(formData).map(([name, value]) => (
                        <li key={name}><strong>{name}</strong>:{value.toString()}</li>
                    ))}
                </ul>
            </div>
            }
            <form onSubmit={handleSubmit}>
                <fieldset disabled={submitting}>
                    <label>
                        <p>Kimlik Numarası</p>
                        <input name="identificationNumber" onChange={handleChange}
                               value={formData.identificationNumber}/>
                    </label>
                    <label>
                        <p>Ad</p>
                        <input name="name" onChange={handleChange} value={formData.name}/>
                    </label>
                    <label>
                        <p>Soyad</p>
                        <input name="surname" onChange={handleChange} value={formData.surname}/>
                    </label>
                    <label>
                        <p>Aylık Gelir</p>
                        <input name="income" onChange={handleChange} value={formData.income}/>
                    </label>
                    <label>
                        <p>Telefon Numarası</p>
                        <input name="phoneNumber" onChange={handleChange} value={formData.phoneNumber}/>
                    </label>
                </fieldset>
                <button type="submit" disabled={submitting}>Sorgula</button>
            </form>
            {
                showRes &&
                <div>
                    {
                        confirmed &&
                        <div>
                            <p>Kimlik Numarası : {data.identificationNumber}</p>
                            <p>İsim : {data.name}</p>
                            <p>Soyad : {data.surname}</p>
                            <p>Limit : {data.limit}</p>
                        </div>
                    }
                    <p>Sonuç : {message} </p>
                </div>
            }
        </div>
    );
}

export default App;
