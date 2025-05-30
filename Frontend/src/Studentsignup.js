import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import './Studentsignup.css';
import axios from 'axios';


// const MAX_IMAGE_MB = 2;
// const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// // Form validation schema
// const validationSchema = Yup.object({
//   rollNumber: Yup.string()
//     .required('Roll number is required  as IC2K2245')
//     .matches(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed'),
//  enrollmentnumber:Yup.string()
//     .required('Enrollemnt Number is required as DX2200715')
//     .matches(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed'),
//   name: Yup.string()
//     .required('Name is required')
//     .min(2, 'Name must be at least 2 characters'),
//   fathername:Yup.string()
//   .required('Father Name is Required')
//   .min(2, 'Name must be at least 2 characters'),
//   parentphone:Yup.string().required('enter your parents number')
//    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
//   email: Yup.string()
//     .required('Email is required')
//     .email('Enter a valid email'),
//   phone: Yup.string()
//     .required('Phone number is required')
//     .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
//   bloodgroup:Yup.string().required("enter your blood group"),
//   address: Yup.string()
//     .required('Address is required')
//     .min(10, 'Address should be at least 10 characters'),
//   dateOfBirth: Yup.date()
//     .required('Date of birth is required')
//     .max(new Date(), 'DOB cannot be in the future'),
//   course: Yup.string().required('Course is required'),
//   batch:Yup.string().required('enter your batch'),
//   semester: Yup.number()
//     .required('Semester is required')
//     .min(1, 'Min semester is 1')
//     .max(8, 'Max semester is 8'),
//   image: Yup.mixed()
//     .required('Photo is required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, (file) => {
//       return file && file.size <= MAX_IMAGE_BYTES;
//     })
//     .test('fileType', 'Only JPEG/PNG images allowed', (file) => {
//       return file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
//     }),
// });

// const Studentsignup = () => {
//   const [savedData, setSavedData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formKey, setFormKey] = useState(0);

//   const handleSubmit = async (values, { setSubmitting, resetForm, setFieldValue }) => {
//     try {
//       const formPayload = new FormData();
//       for (let key in values) {
//         formPayload.append(key, values[key]);
//       }

//       // Simulate POST request
//       // await fetch('/api/students', { method: 'POST', body: formPayload });

//       console.log('Form submitted:', values);
//        alert("Check Your Details twice before submitting ")
//       setSavedData(null); // Save the submitted data for editing

//       setIsEditing(false);
//       setFieldValue('image', null);
//       resetForm();
//       setFormKey(prev => prev + 1);
//     } catch (err) {
//       console.error('Submit error:', err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//   <>

//        <div className='mainheader'>
//           <div className='clglogo'>
//             <img src='/images/iips_logo.png' alt='iips logo'/>
//           </div>
//           <div className='clgdescription'>
//             <h2>Takshashila Campus<br/> Khandwa Road <br/>Indore(M.P)<br/>452001</h2>
//           </div>
//       </div> 
//     <div className="form-container">

//       <div className="form-wrapper">
//         <h2 className="form-title">
//           {isEditing ? 'Update Student Info' : 'Student Information'}
//         </h2>

//         <Formik
//           initialValues={{
//             rollNumber: savedData?.rollNumber || '',
//             enrollmentnumber:savedData?.enrollmentnumber ||'',
//             name: savedData?.name || '',
//             fathername:savedData?.fathername || '',
//             parentphone:savedData?.parentphone || '',
//             email: savedData?.email || '',
//             phone: savedData?.phone || '',
//             bloodgroup:savedData?.bloodgroup || '',
//             address: savedData?.address || '',
//             dateOfBirth: savedData?.dateOfBirth || '',
//             course: savedData?.course || '',
//             batch: savedData?.batch || '',
//             semester: savedData?.semester || '',
//             image: savedData?.image || null,
//           }}
//           enableReinitialize
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ setFieldValue, values, isSubmitting }) => (
//             <Form className="student-form">
//               <div className="form-grid">
//                 {/* Basic Info */}
//                 <div className="form-group">
//                   <label>Roll Number*</label>
//                   <Field name="rollNumber" className="form-input" />
//                   <ErrorMessage name="rollNumber" component="div" className="error-message" />
//                 </div>

//                  <div className="form-group">
//                   <label>Enrollment No*</label>
//                   <Field name="enrollmentnumber" className="form-input" />
//                   <ErrorMessage name="enrollmentnumber" component="div" className="error-message" />
//                 </div>

//                 <div className="form-group">
//                   <label>Full Name*</label>
//                   <Field name="name" className="form-input" />
//                   <ErrorMessage name="name" component="div" className="error-message" />
//                 </div>

//                  <div className="form-group">
//                   <label>Fathers Name*</label>
//                   <Field name="fathername" className="form-input" />
//                   <ErrorMessage name="fathername" component="div" className="error-message" />
//                 </div>

//                  <div className="form-group">
//                   <label>Parent's Phone Number*</label>
//                   <Field name="parentphone" className="form-input" />
//                   <ErrorMessage name="parentphone" component="div" className="error-message" />
//                 </div>

//                 <div className="form-group">
//                   <label>Email*</label>
//                   <Field name="email" type="email" className="form-input" />
//                   <ErrorMessage name="email" component="div" className="error-message" />
//                 </div>

//                 <div className="form-group">
//                   <label>Phone Number*</label>
//                   <Field name="phone" className="form-input" />
//                   <ErrorMessage name="phone" component="div" className="error-message" />
//                 </div>

//                 <div className='form-group'>
//                   <label>Blood Group</label>
//                   <Field as='select' name="bloodgroup" className="form-input">
//                     <option value='' >--Blood Group--</option>
//                     <option value='O+' >O+</option>
//                     <option value='O-' >O-</option>
//                     <option value='A+' >A+</option>
//                     <option value='A-' >A-</option>
//                     <option value='B+' >B+</option>
//                     <option value='B-' >B-</option>
//                     <option value='Ab+' >Ab+</option>
//                     <option value='Ab-' >Ab-</option>
//                   </Field>
//                   <ErrorMessage name="bloodgroup" component='div' className='error-message'/>
//                 </div>

//                 {/* Extended Info */}
//                 <div className="form-group full-width">
//                   <label>Address*</label>
//                   <Field as="textarea" name="address" className="form-input" />
//                   <ErrorMessage name="address" component="div" className="error-message" />
//                 </div>

//                 <div className="form-group">
//                   <label>Date of Birth*</label>
//                   <Field type="date" name="dateOfBirth" className="form-input" />
//                   <ErrorMessage name="dateOfBirth" component="div" className="error-message" />
//                 </div>

//                 <div className="form-group">
//                   <label>Course*</label>
//                   <Field as="select" name="course" className="form-input">
//                     <option value="">--Select Course--</option>
//                     <option value="MCA">MCA</option>
//                     <option value="MTECH">MTECH </option>
//                     <option value="MBA">MBA</option>
//                     <option value="Bcom">Bcom</option>

//                   </Field>
//                   <ErrorMessage name="course" component="div" className="error-message" />
//                 </div>



//                 <div className='form-group'>
//                   <label>Batch*</label>
//                   <Field name="batch" className="form-input"/>
//                   <ErrorMessage name='batch' component='div' className='error-message'/>
//                 </div>

//                 <div className="form-group">
//                   <label>Semester*</label>
//                   <Field type="number" name="semester" className="form-input" />
//                   <ErrorMessage name="semester" component="div" className="error-message" />
//                 </div>

//                 {/* Image Upload */}
//                 <div className="form-group full-width">
//                   <label>Photo Upload* (max 2MB)</label>
//                   <input
//                     key={formKey}
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     className="file-input"
//                     onChange={(e) => setFieldValue('image', e.currentTarget.files[0])}
//                   />
//                   <ErrorMessage name="image" component="div" className="error-message"  />
//                   {values.image && <p className="file-info" >Selected file: {values.image.name}</p>}
//                 </div>
//               </div>

//               {/* Form Buttons */}
//               <div className="button-group">
//                 <button
//                   type="submit"
//                   className="submit-button"
//                   disabled={isSubmitting}

//                 >
//                   {isSubmitting ? 'Please wait...' : 'Submit'}
//                 </button>

//                 {savedData && !isEditing && (
//                   <button
//                     type="button"
//                     className="edit-button"
//                     onClick={() => setIsEditing(true)}

//                   >
//                     Edit Info
//                   </button>
//                 )}
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>

//     </>
//   );
// };

// export default Studentsignup;






// 



const MAX_IMAGE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const validationSchema = Yup.object({
  rollNo: Yup.string()
    .required('Roll number is required as IC2K2222')
    .matches(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed'),
  enrollmentNo: Yup.string()
    .required('Enrollment Number is required as DX2200762')
    .matches(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed'),
  name: Yup.string().required('Name is required').min(2, 'At least 2 characters'),
  fatherName: Yup.string().required('Father name is required').min(2),
  parentContact: Yup.string()
    .required('Parent phone is required')
    .matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  email: Yup.string().required('Email is required').email('Invalid email'),
  contact: Yup.string()  // changed from phone to contact to match your form
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  bloodGroup: Yup.string().required('Blood group required'),
  address: Yup.string().required('Address is required').min(10),
  dateOfBirth: Yup.date().required('DOB required').max(new Date(), 'Invalid DOB'),
  course: Yup.string().required('Course required'),
  batch: Yup.string().required('Batch required'),
  semester: Yup.number().required().min(1).max(8),
  image: Yup.mixed()
    .required('Photo required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
});

const Studentsignup = () => {
  const [savedData, setSavedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // 
  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldValue }) => {
      console.log("Form submitted!", values); // ✅ Add this
  try {
    console.log('Starting form submission with values:', values);

    const formPayload = new FormData();
    for (let key in values) {
      formPayload.append(key, values[key]);
      console.log(`Appending ${key}:`, values[key]);
    }

    console.log('Attempting to call API...');

    // Call Spring Boot backend API using axios
    const response = await axios.post('https://httpbin.org/post', formPayload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    // ✅ If it reaches here, status is 2xx (success)
    alert("Student information saved successfully!");
    console.log('Backend response:', response.data);

    setSavedData(null);
    setIsEditing(false);
    setFieldValue('image', null);
    resetForm();
    setFormKey(prev => prev + 1);

  } catch (err) {
    // ❗axios automatically throws error for non-2xx responses
    console.error('Submit error details:', err);

    const errorMessage =
      err.response?.data?.message || err.message || 'Failed to submit form. Please try again.';

    alert(errorMessage);

  } finally {
    setSubmitting(false);
  }
};

  return (
    <>
      <motion.div
        className="mainheader"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="clglogo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src="/images/iips_logo.png" alt="iips logo" />
        </motion.div>

        <motion.div
          className="clgdescription"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>
            Takshashila Campus<br />
            Khandwa Road <br />
            Indore(M.P)<br />
            452001
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        className="form-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.div
          className="form-wrapper"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="form-title">
            {isEditing ? 'Update Student Info' : 'Student Information'}
          </h2>

          <Formik
            initialValues={{
              rollNo: savedData?.rollNo || '',
              enrollmentNo: savedData?.enrollmentNo || '',
              name: savedData?.name || '',
              fatherName: savedData?.fatherName || '',
              parentContact: savedData?.parentContact || '',
              email: savedData?.email || '',
              contact: savedData?.contact || '',
              bloodGroup: savedData?.bloodGroup || '',
              address: savedData?.address || '',
              dateOfBirth: savedData?.dateOfBirth || '',
              course: savedData?.course || '',
              batch: savedData?.batch || '',
              semester: savedData?.semester || '',
              image: savedData?.image || null,
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form className="student-form">
                <motion.div
                  className="form-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[ 
                    ['rollNo', 'Roll Number*'],
                    ['enrollmentNo', 'Enrollment No*'],
                    ['name', 'Full Name*'],
                    ['fatherName', "Father's Name*"],
                    ['parentContact', "Parent's Phone*"],
                    ['email', 'Email*'],
                    ['contact', 'Phone*'],
                    ['batch', 'Batch*'],
                  ].map(([field, label], index) => (
                    <motion.div
                      className="form-group"
                      key={field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <label>{label}</label>
                      <Field name={field} className="form-input" />
                      <ErrorMessage name={field} component="div" className="error-message" />
                    </motion.div>
                  ))}

                  {/* Dropdown Fields */}
                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label>Blood Group</label>
                    <Field as="select" name="bloodGroup" className="form-input">
                      <option value="">--Blood Group--</option>
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'Ab+', 'Ab-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="bloodGroup" component="div" className="error-message" />
                  </motion.div>
                  
                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label>Date of Birth*</label>
                    <Field type="date" name="dateOfBirth" className="form-input" />
                    <ErrorMessage name="dateOfBirth" component="div" className="error-message" />
                  </motion.div>

                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label>Course*</label>
                    <Field as="select" name="course" className="form-input">
                      <option value="">--Select Course--</option>
                      {['MCA', 'MTECH', 'MBA', 'Bcom'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="course" component="div" className="error-message" />
                  </motion.div>

                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label>Semester*</label>
                    <Field type="number" name="semester" className="form-input" />
                    <ErrorMessage name="semester" component="div" className="error-message" />
                  </motion.div>

                  {/* Address Field */}
                  <motion.div className="form-group full-width" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label>Address*</label>
                    <Field as="textarea" name="address" className="form-input" />
                    <ErrorMessage name="address" component="div" className="error-message" />
                  </motion.div>

                  {/* Image Upload */}
                  <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label>Upload Photo*</label>
                    <input
                      key={formKey}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={event => {
                        setFieldValue('image', event.currentTarget.files[0]);
                      }}
                      className="form-input"
                    />
                    <ErrorMessage name="image" component="div" className="error-message" />
                  </motion.div>
                </motion.div>

               <div className='submitclass'>
               <motion.button
                  type="submit"
                  // className="submit-btn"
                  className='button-group'
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit
                </motion.button>
               </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Studentsignup;


