import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import './Studentsignup.css';
import axios from 'axios';

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
  contact: Yup.string()
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

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
  const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dt36wnzac/image/upload',
      {
        method: 'POST',
    body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image');
  }

  const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

const Studentsignup = () => {
  const [savedData, setSavedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldValue }) => {
    try {
      setSubmitting(true);
      setUploadError(null);

      // Upload image to Cloudinary first
      let imageUrl;
      try {
        imageUrl = await uploadToCloudinary(values.image);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Image upload error:', error);
        setUploadError('Failed to upload image. Please try again.');
        throw error;
      }

      // Prepare payload replacing image file with image URL
      const payload = {
        ...values,
        image: imageUrl,
      };

      console.log('Sending payload:', payload);

      // Call your API endpoint with error handling
      try {
        const response = await axios({
          method: 'post',
          url: 'https://jsonplaceholder.typicode.com/posts',
          data: payload,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        });

        console.log('Response received:', response);

        if (response.status === 201 || response.status === 200) {
      alert("Student information saved successfully!");
      setSavedData(null);
      setIsEditing(false);
      setFieldValue('image', null);
      resetForm();
      setFormKey(prev => prev + 1);
        } else {
          throw new Error('Failed to save student information');
        }
      } catch (axiosError) {
        console.error('Axios error details:', {
          message: axiosError.message,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          config: axiosError.config
        });
        
        if (axiosError.code === 'ERR_NETWORK') {
          throw new Error('Network error: Please check your internet connection and try again.');
        } else if (axiosError.response) {
          throw new Error(`Server error: ${axiosError.response.status} - ${axiosError.response.data?.message || 'Unknown error'}`);
        } else {
          throw new Error('Failed to submit form. Please try again.');
        }
      }

    } catch (err) {
      console.error('Submit error:', err);
      alert(err.message || "Failed to submit form. Please try again.");
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
            key={formKey}
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
            {({ setFieldValue, isSubmitting, values }) => (
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
                        setUploadError(null);
                      }}
                      className="form-input"
                    />
                    <ErrorMessage name="image" component="div" className="error-message" />
                    {uploadError && <div className="error-message">{uploadError}</div>}
                    {values.image && (
                      <div className="image-preview">
                        <p>Selected file: {values.image.name}</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                <div className='submitclass'>
                  <motion.button
                    type="submit"
                    className='button-group'
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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




