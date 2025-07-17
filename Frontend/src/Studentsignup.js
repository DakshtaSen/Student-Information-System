// import React, { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { motion, AnimatePresence } from 'framer-motion';
// import './Studentsignup.css';
// import axios from 'axios';

// const MAX_IMAGE_MB = 2;
// const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// const validationSchema = Yup.object({
//   rollNo: Yup.string()
//     .required('Roll number is required as IC-2K22-22')
//     .matches(/^[A-Za-z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens allowed'),
//   enrollmentNo: Yup.string()
//     // .required('Enrollment Number is required')
//     .matches(/^[A-Za-z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens allowed'),
//   cuetno: Yup.string()
//     .required(" CUET number is required"),
//     //.matches(/^[A-Za-z0-9-]+$/,'CUET nuber is required'),
//   name: Yup.string().required('Name is required').min(2, 'At least 2 characters'),
//   fatherName: Yup.string().required('Father name is required').min(2),
//   parentContact: Yup.string()
//     .required('Parent phone is required')
//     .matches(/^[0-9]{10}$/, 'Must be 10 digits'),
//   email: Yup.string().required('Email is required').email('Invalid email'),
//   contact: Yup.string()
//     .required('Phone number is required')
//     .matches(/^[0-9]{10}$/, 'Must be 10 digits'),
//   bloodGroup: Yup.string().required('Blood group required'),
//   gender: Yup.string().required('Gender is required'),
//   address: Yup.string().required('Address is required').min(10),
//   dob: Yup.date().required('DOB required').max(new Date(), 'Invalid DOB'),
//   course: Yup.string().required('Course required'),
//   batch: Yup.string().required('Batch required'),
//   image: Yup.mixed()
//     .required('Photo required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
//     .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
//   aadharImage: Yup.mixed()
//     .required('Aadhar card photo is required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
//     .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),

//   admissionSlip: Yup.mixed()
//     .required('Admission slip photo is required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
//     .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),

// });

// const uploadToCloudinary = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'ml_default');

//     const response = await fetch(
//       'https://api.cloudinary.com/v1_1/dt36wnzac/image/upload',
//       {
//         method: 'POST',
//         body: formData,
//         mode: 'cors',
//         headers: { 'Accept': 'application/json' },
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'Failed to upload image');
//     }

//     const data = await response.json();
//     return data.secure_url;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     throw new Error('Failed to upload image. Please try again.');
//   }
// };

// const Studentsignup = () => {
//   const [savedData, setSavedData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formKey, setFormKey] = useState(0);
//   const [uploadError, setUploadError] = useState(null);

//   const handleSubmit = async (values, { setSubmitting, resetForm, setFieldValue }) => {
//     try {
//       setSubmitting(true);
//       setUploadError(null);

//       // Upload all images to Cloudinary
//       let imageUrl = await uploadToCloudinary(values.image);
//       let aadharImageUrl = await uploadToCloudinary(values.aadharImage);
//       let admissionSlipUrl = await uploadToCloudinary(values.admissionSlip);

//       const payload = {
//         ...values,
//         image: imageUrl,
//         aadharImage: aadharImageUrl,
//         admissionSlip: admissionSlipUrl,
//       };

//        const response = await axios.post('http://localhost:8080/api/student/register', payload, {
//       // const response = await axios.post('https://jsonplaceholder.typicode.com/posts', payload, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         timeout: 10000,
//       });

//       if (response.status === 201 || response.status === 200) {
//         alert("Student information saved successfully!");
//         setSavedData(null);
//         setIsEditing(false);
//         setFieldValue('image', null);
//         setFieldValue('aadharImage', null);
//         setFieldValue('admissionSlip', null);
//         resetForm();
//         setFormKey(prev => prev + 1);
//         console.log(response);
//         console.log('Uploaded Profile Image:', imageUrl);
//         console.log('Uploaded Aadhar Image:', aadharImageUrl);
//         console.log('Uploaded Admission Slip:', admissionSlipUrl);

//       } else {
//         throw new Error('Failed to save student information');
//       }

//     } catch (err) {
//       console.error('Submit error:', err);
//       alert(err.message || "Failed to submit form. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <motion.div className="signup-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//       <motion.div className="form-card">
//         <motion.div className="form-header" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
//           <div className="logo-container"><img src="/images/iips_logo.png" alt="iips logo" /></div>
//           <div className="header-text">
//             <h1>Student Registration</h1>
//             <p>Takshashila Campus, Khandwa Road, Indore (M.P) 452001</p>
//           </div>
//         </motion.div>

//         <Formik
//           key={formKey}
//           initialValues={{
//             rollNo: savedData?.rollNo || '',
//             enrollmentNo: savedData?.enrollmentNo || '',
//             cuetno:savedData?.cuetno ||'',
//             name: savedData?.name || '',
//             fatherName: savedData?.fatherName || '',
//             parentContact: savedData?.parentContact || '',
//             email: savedData?.email || '',
//             contact: savedData?.contact || '',
//             bloodGroup: savedData?.bloodGroup || '',
//             gender: savedData?.gender || '',
//             address: savedData?.address || '',
//             dob: savedData?.dob || '',
//             course: savedData?.course || '',
//             batch: savedData?.batch || '',
//             image: savedData?.image || null,
//             aadharImage: savedData?.aadharImage || null,
//             admissionSlip: savedData?.admissionSlip || null,
//           }}
//           enableReinitialize
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ setFieldValue, isSubmitting, values }) => (
//             <Form className="student-form">
//               {/* Personal Info */}
//               <div className="form-section">
//                 <h2>Personal Information</h2>
//                 <div className="form-grid">
//                   {[
//                     ['name', 'Full Name*'],
//                     ['fatherName', "Father's Name*"],
//                     ['dob', 'Date of Birth*'],
//                     ['gender', 'Gender*'],
//                     ['bloodGroup', 'Blood Group*'],
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       {field === 'bloodGroup' || field === 'gender' ? (
//                         <Field as="select" name={field} className="form-input">
//                           <option value="">{`Select ${label.replace('*', '')}`}</option>
//                           {(field === 'bloodGroup'
//                             ? ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'Ab+', 'Ab-']
//                             : ['Male', 'Female', 'Other']
//                           ).map(opt => (
//                             <option key={opt} value={opt}>{opt}</option>
//                           ))}
//                         </Field>
//                       ) : (
//                         <Field
//                           type={field === 'dob' ? 'date' : 'text'}
//                           name={field}
//                           className="form-input"
//                           placeholder={`Enter ${label.replace('*', '')}`}
//                         />
//                       )}
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Academic Info */}
//               <div className="form-section">
//                 <h2>Academic Information</h2>
//                 {/* <div className="form-grid">
//                   {[
//                     ['rollNo', 'Roll Number*'],
//                     ['enrollmentNo', 'Enrollment No*'],
//                     ['course', 'Course*'],
//                     ['batch', 'Batch*'],
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       {field === 'course' ? (
//                         <Field as="select" name={field} className="form-input">
//                           <option value="">Select Course</option>
//                           {["MCA-5yrs", "MTech (IT)-5yrs","MTech (CS)-5yrs","MBA (MS)-5yrs","MBA (MS)-2yrs"
//                             ,"MBA (T)-5yrs","MBA (Eship)","MBA (APR)", "BCom (Hons.)","Phd (Computer)","Pdh (Management)"].map(c => (
//                             <option key={c} value={c}>{c}</option>
//                           ))}
//                         </Field>
//                       ) : (
//                         <Field
//                           type="text"
//                           name={field}
//                           className="form-input"
//                           placeholder={`Enter ${label.replace('*', '')}`}
//                         />
//                       )}
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div> */}
//                 <div className="form-grid">
//                   {[
//                     ['rollNo', 'Roll Number*'],
//                     ['enrollmentNo', 'Enrollment No'],
//                     ['course', 'Course*'],
//                     ['batch', 'Batch*'],
//                     ['cuetno','CUET Application No*']
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       {field === 'course' ? (
//                         <Field as="select" name={field} className="form-input">
//                           <option value="">Select Course</option>
//                           {[
//                             "MCA-5yrs",
//                             "MTech (IT)-5yrs",
//                             "MTech (CS)-5yrs",
//                             "MBA (MS)-5yrs",
//                             "MBA (MS)-2yrs",
//                             "MBA (T)-5yrs",
//                             "MBA (Eship)",
//                             "MBA (APR)",
//                             "BCom (Hons.)",
//                             "Phd (Computer)",
//                             "Pdh (Management)",
//                           ].map(c => (
//                             <option key={c} value={c}>{c}</option>
//                           ))}
//                         </Field>
//                       ) : field === 'batch' ? (
//                         <Field as="select" name={field} className="form-input">
//                           <option value="">Select Batch</option>
//                           {["2021", "2022", "2023", '2024', '2025'].map(b => (
//                             <option key={b} value={b}>{b}</option>
//                           ))}
//                         </Field>
//                       ) : (
//                         <Field
//                           type="text"
//                           name={field}
//                           className="form-input"
//                           placeholder={`Enter ${label.replace('*', '')}`}
//                         />
//                       )}
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div>

//               </div>

//               {/* Contact Info */}
//               <div className="form-section">
//                 <h2>Contact Information</h2>
//                 <div className="form-grid">
//                   {[
//                     ['email', 'Email*'],
//                     ['contact', 'Phone*'],
//                     ['parentContact', "Father's Phone*"],
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       <Field
//                         type={field === 'email' ? 'email' : 'tel'}
//                         name={field}
//                         className="form-input"
//                         placeholder={`Enter ${label.replace('*', '')}`}
//                       />
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Address */}
//               <div className="form-section">
//                 <h2>Address</h2>
//                 <div className="form-group full-width">
//                   <label>Full Address*</label>
//                   <Field as="textarea" name="address" className="form-input" />
//                   <ErrorMessage name="address" component="div" className="error-message" />
//                 </div>
//               </div>

//               {/* Image Upload */}
//               {/* <div className="form-section">
//                 <h2>Photo Upload</h2>
//                 <div className="form-group full-width photoupload">
//                   <label>Upload Photo*</label>
//                   <input
//                     key={formKey}
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={event => {
//                       setFieldValue('image', event.currentTarget.files[0]);
//                       setUploadError(null);
//                     }}
//                     className="file-input"
//                   />
//                   <ErrorMessage name="image" component="div" className="error-message" />
//                   {uploadError && <div className="error-message">{uploadError}</div>}
             
//                 </div>
//               </div> */}

//               <div className="form-section">
//                 <h2>Document's Upload</h2>
//                 <div className='imagesection'>
//                   {/* Profile Image */}
//                   <div className="form-group full-width photoupload">
//                     <label>Upload Profile Photo*</label>
//                     <input
//                       key={formKey + '-image'}
//                       type="file"
//                       name="image"
//                       accept="image/*"
//                       onChange={e => setFieldValue('image', e.currentTarget.files[0])}
//                       className="file-input input-img"
//                     />
//                     <ErrorMessage name="image" component="div" className="error-message" />
//                     {values.image && typeof values.image !== 'string' && (
//                       <img src={URL.createObjectURL(values.image)} alt="Profile Preview" height={120}  width={'100%'}/>
//                     )}
//                   </div>

//                   {/* Aadhar Image */}
//                   <div className="form-group full-width photoupload">
//                     <label>Upload Aadhar Card*</label>
//                     <input
//                       key={formKey + '-aadhar'}
//                       type="file"
//                       name="aadharImage"
//                       accept="image/*"
//                       onChange={e => setFieldValue('aadharImage', e.currentTarget.files[0])}
//                       className="file-input input-img"
//                     />
//                     <ErrorMessage name="aadharImage" component="div" className="error-message" />
//                     {values.aadharImage && typeof values.aadharImage !== 'string' && (
//                       <img src={URL.createObjectURL(values.aadharImage)} alt="Aadhar Preview" height={120} width={'100%'} />
//                     )}
//                   </div>

//                   {/* Admission Slip */}
//                   <div className="form-group full-width photoupload">
//                     <label>Upload Admission Slip*</label>
//                     <input
//                       key={formKey + '-slip'}
//                       type="file"
//                       name="admissionSlip"
//                       accept="image/*"
//                       onChange={e => setFieldValue('admissionSlip', e.currentTarget.files[0])}
//                       className="file-input input-img"
//                     />
//                     <ErrorMessage name="admissionSlip" component="div" className="error-message" />
//                     {values.admissionSlip && typeof values.admissionSlip !== 'string' && (
//                       <img src={URL.createObjectURL(values.admissionSlip)} alt="Slip Preview" height={120} width={'100%'} />
//                     )}
//                   </div>
//                 </div>
//               </div>


//               {/* Submit Button */}
//               <div className="submit-section">
//                 <motion.button
//                   type="submit"
//                   className="submit-button"
//                   disabled={isSubmitting}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit Registration'}
//                 </motion.button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Studentsignup;


//it includes error message in the form
//it includes edit mode in the form
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { motion } from 'framer-motion';
// import './Studentsignup.css';
// import axios from 'axios';

// const MAX_IMAGE_MB = 2;
// const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// const validationSchema = Yup.object({
//   rollNo: Yup.string()
//     .required('Roll number is required')
//     .matches(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed'),
//   enrollmentNo: Yup.string().matches(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed'),
//   cuetno: Yup.string().required("CUET number is required"),
//   name: Yup.string().required('Name is required').min(2),
//   fatherName: Yup.string().required('Father name is required').min(2),
//   parentContact: Yup.string().required('Parent phone is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
//   email: Yup.string().required('Email is required').email('Invalid email'),
//   contact: Yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
//   bloodGroup: Yup.string().required('Blood group required'),
//   gender: Yup.string().required('Gender is required'),
//   address: Yup.string().required('Address is required').min(10),
//   dob: Yup.date().required('DOB required').max(new Date(), 'Invalid DOB'),
//   course: Yup.string().required('Course required'),
//   batch: Yup.string().required('Batch required'),
//   image: Yup.mixed()
//     .required('Photo required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
//     .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
//   aadharImage: Yup.mixed()
//     .required('Aadhar card photo required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
//     .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
//   admissionSlip: Yup.mixed()
//     .required('Admission slip photo required')
//     .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
//     .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
// });

// const uploadToCloudinary = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', 'ml_default');

//   const res = await fetch('https://api.cloudinary.com/v1_1/dt36wnzac/image/upload', {
//     method: 'POST',
//     body: formData,
//   });

//   const data = await res.json();
//   return data.secure_url;
// };

// const Studentsignup = () => {
//   const location = useLocation();
//   const token = new URLSearchParams(location.search).get('token');
//   const isEditMode = !!token; // Automatically detect edit mode from token

//   const [savedData, setSavedData] = useState(null);
//   const [formKey, setFormKey] = useState(0);
//   const [loading, setLoading] = useState(isEditMode);

//   useEffect(() => {
//     if (isEditMode && token) {
//       axios.get(`http://localhost:8080/api/student/info?token=${token}`)
//         .then(res => setSavedData(res.data))
//         .catch(() => alert("Failed to fetch student data"))
//         .finally(() => setLoading(false));
//     }
//   }, [isEditMode, token]);

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       setSubmitting(true);

//       const imageUrl = typeof values.image === 'string' ? values.image : await uploadToCloudinary(values.image);
//       const aadharUrl = typeof values.aadharImage === 'string' ? values.aadharImage : await uploadToCloudinary(values.aadharImage);
//       const slipUrl = typeof values.admissionSlip === 'string' ? values.admissionSlip : await uploadToCloudinary(values.admissionSlip);

//       const payload = {
//         ...values,
//         image: imageUrl,
//         aadharImage: aadharUrl,
//         admissionSlip: slipUrl,
//       };

//       // Log the payload being sent
//       console.log('Payload being sent to backend:', payload);
//       console.log('Mode:', isEditMode ? 'Edit Mode' : 'Registration Mode');

//       const url = isEditMode
//         ? `http://localhost:8080/api/student/update?token=${token}`
//         : `http://localhost:8080/api/student/register`;
//         // : `https://jsonplaceholder.typicode.com/posts`;
         

//       const method = isEditMode ? 'put' : 'post';

//       const res = await axios({
//         method,
//         url,
//         data: payload,
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (res.status === 200 || res.status === 201) {
//         alert(isEditMode ? "Student info updated successfully." : "Student registered successfully.");
//         resetForm();
//         setFormKey(k => k + 1);
//       }
//     } catch (err) {
//       console.error('Error details:', err);
      
//       if (err.response) {
//         // Server responded with error status
//         const status = err.response.status;
//         const data = err.response.data;
        
//         console.log('Error response:', { status, data });
        
//         let errorMessage = 'An error occurred. Please try again.';
        
//         if (status === 400) {
//           errorMessage = data?.message || data?.error || 'Invalid data provided. Please check your information.';
//         } else if (status === 401) {
//           errorMessage = 'Unauthorized. Please check your credentials.';
//         } else if (status === 403) {
//           errorMessage = 'Access denied. You do not have permission to perform this action.';
//         } else if (status === 404) {
//           errorMessage = isEditMode ? 'Student not found or edit link is invalid.' : 'Registration endpoint not found.';
//         } else if (status === 409) {
//           errorMessage = data?.message || 'Student with this information already exists.';
//         } else if (status === 422) {
//           errorMessage = data?.message || 'Validation error. Please check your input.';
//         } else if (status >= 500) {
//           // Handle backend RuntimeException messages
//           if (data?.message) {
//             errorMessage = data.message;
//           } else if (typeof data === 'string') {
//             errorMessage = data;
//           } else {
//             errorMessage = 'Server error. Please try again later.';
//           }
//         } else {
//           // For any other status codes, try to get the message from backend
//           if (data?.message) {
//             errorMessage = data.message;
//           } else if (typeof data === 'string') {
//             errorMessage = data;
//           } else {
//             errorMessage = data?.error || `Server error (${status}). Please try again.`;
//           }
//         }
        
//         alert(errorMessage);
//       } else if (err.request) {
//         // Network error - no response received
//         console.error('Network error:', err.request);
//         alert('Network error. Please check your internet connection and try again.');
//       } else {
//         // Other errors (like Cloudinary upload errors)
//         console.error('Other error:', err.message);
//         alert(err.message || 'An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="loading">Loading student data...</div>;

//   return (
//     <motion.div className="signup-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//       <motion.div className="form-card">
//         <div className="form-header">
//           <div className="logo-container"><img src="/images/iips_logo.png" alt="logo" /></div>
//           <div className="header-text">
//             <h1>{isEditMode ? "Edit Student Info" : "Student Registration"}</h1>
//             <p>Takshashila Campus, Indore</p>
//           </div>
//         </div>

//         <Formik
//           key={formKey}
//           initialValues={{
//             rollNo: savedData?.rollNo || '',
//             enrollmentNo: savedData?.enrollmentNo || '',
//             cuetno: savedData?.cuetno || '',
//             name: savedData?.name || '',
//             fatherName: savedData?.fatherName || '',
//             parentContact: savedData?.parentContact || '',
//             email: savedData?.email || '',
//             contact: savedData?.contact || '',
//             bloodGroup: savedData?.bloodGroup || '',
//             gender: savedData?.gender || '',
//             address: savedData?.address || '',
//             dob: savedData?.dob || '',
//             course: savedData?.course || '',
//             batch: savedData?.batch || '',
//             image: savedData?.image || null,
//             aadharImage: savedData?.aadharImage || null,
//             admissionSlip: savedData?.admissionSlip || null,
//           }}
//           enableReinitialize
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ setFieldValue, isSubmitting, values }) => (
//             <Form className="student-form">

//               {/* Section - Personal Info */}
//               <div className="form-section">
//                 <h2>Personal Info</h2>
//                 <div className="form-grid">
//                   {[
//                     ['name', 'Full Name*'],
//                     ['fatherName', "Father's Name*"],
//                     ['dob', 'Date of Birth*'],
//                     ['gender', 'Gender*'],
//                     ['bloodGroup', 'Blood Group*'],
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       {['gender', 'bloodGroup'].includes(field) ? (
    
//                         <Field as="select" name={field} disabled={isEditMode && field !== 'name'} className="form-input">

//                           <option value="">Select</option>
//                           {(field === 'bloodGroup' ? ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] : ['Male', 'Female', 'Other'])
//                             .map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                         </Field>
//                       ) : (
//                         <Field type={field === 'dob' ? 'date' : 'text'} name={field} className="form-input" disabled={isEditMode && !['name'].includes(field)} />
//                       )}
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Section - Academic Info */}
//               <div className="form-section">
//                 <h2>Academic Info</h2>
//                 <div className="form-grid">
//                   {[
//                     ['rollNo', 'Roll Number*'],
//                     ['enrollmentNo', 'Enrollment No'],
//                     ['course', 'Course*'],
//                     ['batch', 'Batch*'],
//                     ['cuetno', 'CUET Application No*'],
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       {['course', 'batch'].includes(field) ? (
//                         <Field as="select" name={field} disabled={isEditMode} className="form-input">
//                           <option value="">Select</option>
//                           {(field === 'course'
//                             ? ["MCA-5yrs", "MTech (IT)-5yrs", "MTech (CS)-5yrs", "MBA (MS)-5yrs", "MBA (MS)-2yrs", "MBA (T)-5yrs", "MBA (Eship)", "MBA (APR)", "BCom (Hons.)", "Phd (Computer)", "Pdh (Management)"]
//                             : ["2021", "2022", "2023", "2024", "2025"]
//                           ).map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                         </Field>
//                       ) : (
//                         <Field type="text" name={field} className="form-input" disabled={isEditMode && !['enrollmentNo'].includes(field)} />
//                       )}
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Section - Contact */}
//               <div className="form-section">
//                 <h2>Contact</h2>
//                 <div className="form-grid">
//                   {[
//                     ['email', 'Email*'],
//                     ['contact', 'Phone*'],
//                     ['parentContact', "Father's Phone*"]
//                   ].map(([field, label]) => (
//                     <div className="form-group" key={field}>
//                       <label>{label}</label>
//                       <Field type="text" name={field} className="form-input" disabled={isEditMode && !['email', 'contact', 'parentContact'].includes(field)} />
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Section - Address */}
//               <div className="form-section">
//                 <h2>Address</h2>
//                 <div className="form-group full-width">
//                   <label>Full Address*</label>
//                   <Field as="textarea" name="address" className="form-input" disabled={isEditMode ? false : undefined} />
//                   <ErrorMessage name="address" component="div" className="error-message" />
//                 </div>
//               </div>

//               {/* Section - Documents */}
//               <div className="form-section">
//                 <h2>Documents</h2>
//                 <div className="imagesection">
//                   {[
//                     ['image', 'Profile Photo'],
//                     ['aadharImage', 'Aadhar Card'],
//                     ['admissionSlip', 'Admission Slip']
//                   ].map(([field, label]) => (
//                     <div className="form-group full-width photoupload" key={field}>
//                       <label>{label}*</label>
//                       <input
//                         type="file"
//                         name={field}
//                         accept="image/*"
//                         disabled={isEditMode}
//                         onChange={(e) => setFieldValue(field, e.currentTarget.files[0])}
//                       />
//                       <ErrorMessage name={field} component="div" className="error-message" />
//                       {values[field] && typeof values[field] !== 'string' && (
//                         <img src={URL.createObjectURL(values[field])} alt="Preview" height={120} width="100%" />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit */}
//               <div className="submit-section">
//                 <motion.button
//                   type="submit"
//                   className="submit-button"
//                   disabled={isSubmitting}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Info' : 'Submit Registration'}
//                 </motion.button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Studentsignup;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import './Studentsignup.css';
import axios from 'axios';

const MAX_IMAGE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const validationSchema = Yup.object({
  rollNo: Yup.string().required('Roll number is required').matches(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed'),
  enrollmentNo: Yup.string().matches(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed'),
  cuetno: Yup.string().required("CUET number is required"),
  name: Yup.string().required('Name is required').min(2),
  fatherName: Yup.string().required('Father name is required').min(2),
  parentContact: Yup.string().required('Parent phone is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  email: Yup.string().required('Email is required').email('Invalid email'),
  contact: Yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  bloodGroup: Yup.string().required('Blood group required'),
  gender: Yup.string().required('Gender is required'),
  address: Yup.string().required('Address is required').min(10),
  dob: Yup.date().required('DOB required').max(new Date(), 'Invalid DOB'),
  course: Yup.string().required('Course required'),
  batch: Yup.string().required('Batch required'),
  image: Yup.mixed()
    .required('Photo required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
  aadharImage: Yup.mixed()
    .required('Aadhar card photo required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
  admissionSlip: Yup.mixed()
    .required('Admission slip photo required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
});

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  const res = await fetch('https://api.cloudinary.com/v1_1/dt36wnzac/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

const Studentsignup = () => {
  const { token } = useParams();
  const isEditMode = !!token;

  const [savedData, setSavedData] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && token) {
      axios.get(`https://student-information-system-production-9468.up.railway.app/api/student/editstudent/${token}`)
        .then(res => setSavedData(res.data))
        .catch(() => alert("Failed to fetch student data"))
        .finally(() => setLoading(false));
    }
  }, [isEditMode, token]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const imageUrl = typeof values.image === 'string' ? values.image : await uploadToCloudinary(values.image);
      const aadharUrl = typeof values.aadharImage === 'string' ? values.aadharImage : await uploadToCloudinary(values.aadharImage);
      const slipUrl = typeof values.admissionSlip === 'string' ? values.admissionSlip : await uploadToCloudinary(values.admissionSlip);

      const payload = {
        ...values,
        image: imageUrl,
        aadharImage: aadharUrl,
        admissionSlip: slipUrl,
      };

      const url = isEditMode
        ? `https://student-information-system-production-9468.up.railway.app/api/student/editstudent/${token}`
        : 'https://student-information-system-production-9468.up.railway.app/api/student/register';

      const method = isEditMode ? 'put' : 'post';

      const res = await axios({
        method,
        url,
        data: payload,
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200 || res.status === 201) {
        alert(isEditMode ? "Student info updated successfully." : "Student registered successfully.");

        if (isEditMode) {
          const updatedRes = await axios.get(`https://student-information-system-production-9468.up.railway.app/api/student/editstudent/${token}`);
          setSavedData(updatedRes.data);
          setFormKey(k => k + 1);
        } else {
          resetForm();
          setFormKey(k => k + 1);
        }
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading student data...</div>;

  return (
    <motion.div className="signup-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="form-card">
        <div className="form-header">
          <div className="logo-container"><img src="/images/iips_logo.png" alt="logo" /></div>
          <div className="header-text">
            <h1>{isEditMode ? "Edit Student Info" : "Student Registration"}</h1>
            <p>Takshashila Campus, Indore</p>
          </div>
        </div>

        <Formik
          key={formKey}
          initialValues={{
            rollNo: savedData?.rollNo || '',
            enrollmentNo: savedData?.enrollmentNo || '',
            cuetno: savedData?.cuetno || '',
            name: savedData?.name || '',
            fatherName: savedData?.fatherName || '',
            parentContact: savedData?.parentContact || '',
            email: savedData?.email || '',
            contact: savedData?.contact || '',
            bloodGroup: savedData?.bloodGroup || '',
            gender: savedData?.gender || '',
            address: savedData?.address || '',
            dob: savedData?.dob ? savedData.dob.split('T')[0] : '',
            course: savedData?.course || '',
            batch: savedData?.batch || '',
            image: savedData?.image || null,
            aadharImage: savedData?.aadharImage || null,
            admissionSlip: savedData?.admissionSlip || null,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="student-form">

              <div className="form-section">
                <h2>Personal Info</h2>
                <div className="form-grid">
                  {[
                    ['name', 'Full Name*'],
                    ['fatherName', "Father's Name*"],
                    ['dob', 'Date of Birth*'],
                    ['gender', 'Gender*'],
                    ['bloodGroup', 'Blood Group*'],
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      {['gender', 'bloodGroup'].includes(field) ? (
                        <Field as="select" name={field} disabled={isEditMode && field !== 'name'} className="form-input">
                          <option value="">Select</option>
                          {(field === 'bloodGroup' ? ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] : ['Male', 'Female', 'Other'])
                            .map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </Field>
                      ) : (
                        <Field type={field === 'dob' ? 'date' : 'text'} name={field} className="form-input" disabled={isEditMode && !['name'].includes(field)} />
                      )}
                      <ErrorMessage name={field} component="div" className="error-message" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>Academic Info</h2>
                <div className="form-grid">
                  {[
                    ['rollNo', 'Roll Number*'],
                    ['enrollmentNo', 'Enrollment No'],
                    ['course', 'Course*'],
                    ['batch', 'Batch*'],
                    ['cuetno', 'CUET Application No*'],
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      {['course', 'batch'].includes(field) ? (
                        <Field as="select" name={field} disabled={isEditMode} className="form-input">
                          <option value="">Select</option>
                          {(field === 'course'
                            ? ["MCA-5yrs", "MTech (IT)-5yrs", "MTech (CS)-5yrs", "MBA (MS)-5yrs", "MBA (MS)-2yrs", "MBA (T)-5yrs", "MBA (Eship)", "MBA (APR)", "BCom (Hons.)", "Phd (Computer)", "Pdh (Management)"]
                            : ["2021", "2022", "2023", "2024", "2025"]
                          ).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </Field>
                      ) : (
                        <Field type="text" name={field} className="form-input" disabled={isEditMode && !['enrollmentNo'].includes(field)} />
                      )}
                      <ErrorMessage name={field} component="div" className="error-message" />
                    </div>
                  ))}
                </div> 
                <div className="form-grid">
                  {[
                    ['rollNo', 'Roll Number*'],
                    ['enrollmentNo', 'Enrollment No'],
                    ['course', 'Course*'],
                    ['batch', 'Batch*'],
                    ['cuetno','CUET Application No*']
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      {field === 'course' ? (
                        <Field as="select" name={field} className="form-input">
                          <option value="">Select Course</option>
                          {[
                            "MCA-5yrs",
                            "MTech (IT)-5yrs",
                            "MTech (CS)-5yrs",
                            "MBA (MS)-5yrs",
                            "MBA (MS)-2yrs",
                            "MBA (T)-5yrs",
                            "MBA (Eship)",
                            "MBA (APR)",
                            "BCom (Hons.)",
                            "Phd (Computer)",
                            "Pdh (Management)",
                          ].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </Field>
                      ) : field === 'batch' ? (
                        <Field as="select" name={field} className="form-input">
                          <option value="">Select Batch</option>
                          {["2021", "2022", "2023", '2024', '2025'].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </Field>
                      ) : (
                        <Field
                          type="text"
                          name={field}
                          className="form-input"
                          placeholder={`Enter ${label.replace('*', '')}`}
                        />
                      )}
                      <ErrorMessage name={field} component="div" className="error-message" />
                    </div>
                  ))}
                </div>

              </div>

              <div className="form-section">
                <h2>Contact</h2>
                <div className="form-grid">
                  {[
                    ['email', 'Email*'],
                    ['contact', 'Phone*'],
                    ['parentContact', "Father's Phone*"]
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      <Field type="text" name={field} className="form-input" disabled={isEditMode && !['email', 'contact', 'parentContact'].includes(field)} />
                      <ErrorMessage name={field} component="div" className="error-message" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>Address</h2>
                <div className="form-group full-width">
                  <label>Full Address*</label>
                  <Field as="textarea" name="address" className="form-input" disabled={isEditMode ? false : undefined} />
                  <ErrorMessage name="address" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-section">
                <h2>Documents</h2>
                <div className="imagesection">
                  {[
                    ['image', 'Profile Photo'],
                    ['aadharImage', 'Aadhar Card'],
                    ['admissionSlip', 'Admission Slip']
                  ].map(([field, label]) => (
                    <div className="form-group full-width photoupload" key={field}>
                      <label>{label}*</label>
                      <input
                        type="file"
                        name={field}
                        accept="image/*"
                        onChange={(e) => setFieldValue(field, e.currentTarget.files[0])}
                      />
                      <ErrorMessage name={field} component="div" className="error-message" />
                      {values[field] && typeof values[field] === 'string' && (
                        <img src={values[field]} alt="Uploaded" height={120} width="100%" />
                      )}
                      {values[field] && typeof values[field] !== 'string' && (
                        <img src={URL.createObjectURL(values[field])} alt="Preview" height={120} width="100%" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="submit-section">
                <motion.button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Info' : 'Submit Registration'}
                </motion.button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  );
};

export default Studentsignup;
