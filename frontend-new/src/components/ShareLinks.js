import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/sharelinks.css'

const ShareLinks = ({ user, titles, links, setShow }) => {
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_rec2tck', 'template_wgnk8gf', form.current, {
        publicKey: '3mEQH3Tj2EKsuzRiR',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setShow(false)
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  const populateLinks = (titles, links) => {
    if (titles?.length) {
      let message = 'Hey there,\n\nHere are the book links,'
      for (let i = 0; i < titles.length; i++) {
          message += `\n${titles[i]}:\n${links[i]}`
      }
      return message
    }
  } 

  return (
    <form ref={form} onSubmit={sendEmail} className='form-popup'>
      <label onClick={() => setShow(false)} className='exit-button'>✖</label>
      <label>Name</label>
      <input type="text" name="user_name" defaultValue={user} />
      <label>Send To</label>
      <input type="email" name="user_email" />
      <label className='message-label'>Message</label>
      <textarea name="message" defaultValue={populateLinks(titles, links)} />
      <button type="submit" className='submit-button'>Send Email</button>
    </form>
  );
};

export default ShareLinks