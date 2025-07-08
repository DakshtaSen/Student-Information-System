import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import './Studentsignup.css';
import axios from 'axios';

const MAX_IMAGE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const validationSchema = Yup.object({
  rollNo: Yup.string()
    .required('Roll number is required as IC-2K22-22')
    .matches(/^[A-Za-z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens allowed'),
  enrollmentNo: Yup.string()
    // .required('Enrollment Number is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens allowed'),
  cuetno: Yup.string()
    .required(" CUET number is required"),
    //.matches(/^[A-Za-z0-9-]+$/,'CUET nuber is required'),
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
  gender: Yup.string().required('Gender is required'),
  address: Yup.string().required('Address is required').min(10),
  dateOfBirth: Yup.date().required('DOB required').max(new Date(), 'Invalid DOB'),
  course: Yup.string().required('Course required'),
  batch: Yup.string().required('Batch required'),
  image: Yup.mixed()
    .required('Photo required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
  aadharImage: Yup.mixed()
    .required('Aadhar card photo is required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),

  admissionSlip: Yup.mixed()
    .required('Admission slip photo is required')
    .test('fileSize', `Max file size is ${MAX_IMAGE_MB}MB`, file => file && file.size <= MAX_IMAGE_BYTES)
    .test('fileType', 'Only JPEG/PNG allowed', file => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),

});

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
        headers: { 'Accept': 'application/json' },
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

      // Upload all images to Cloudinary
      let imageUrl = await uploadToCloudinary(values.image);
      let aadharImageUrl = await uploadToCloudinary(values.aadharImage);
      let admissionSlipUrl = await uploadToCloudinary(values.admissionSlip);

      const payload = {
        ...values,
        image: imageUrl,
        aadharImage: aadharImageUrl,
        admissionSlip: admissionSlipUrl,
      };

       const response = await axios.post('http://localhost:8080/api/student/register', payload, {
      // const response = await axios.post('https://jsonplaceholder.typicode.com/posts', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      if (response.status === 201 || response.status === 200) {
        alert("Student information saved successfully!");
        setSavedData(null);
        setIsEditing(false);
        setFieldValue('image', null);
        setFieldValue('aadharImage', null);
        setFieldValue('admissionSlip', null);
        resetForm();
        setFormKey(prev => prev + 1);
        console.log(response);
        console.log('Uploaded Profile Image:', imageUrl);
        console.log('Uploaded Aadhar Image:', aadharImageUrl);
        console.log('Uploaded Admission Slip:', admissionSlipUrl);

      } else {
        throw new Error('Failed to save student information');
      }

    } catch (err) {
      console.error('Submit error:', err);
      alert(err.message || "Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="signup-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="form-card">
        <motion.div className="form-header" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="logo-container"><img src="/images/iips_logo.png" alt="iips logo" /></div>
          <div className="header-text">
            <h1>Student Registration</h1>
            <p>Takshashila Campus, Khandwa Road, Indore (M.P) 452001</p>
          </div>
        </motion.div>

        <Formik
          key={formKey}
          initialValues={{
            rollNo: savedData?.rollNo || '',
            enrollmentNo: savedData?.enrollmentNo || '',
            cuetno:savedData?.cuetno ||'',
            name: savedData?.name || '',
            fatherName: savedData?.fatherName || '',
            parentContact: savedData?.parentContact || '',
            email: savedData?.email || '',
            contact: savedData?.contact || '',
            bloodGroup: savedData?.bloodGroup || '',
            gender: savedData?.gender || '',
            address: savedData?.address || '',
            dateOfBirth: savedData?.dateOfBirth || '',
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
              {/* Personal Info */}
              <div className="form-section">
                <h2>Personal Information</h2>
                <div className="form-grid">
                  {[
                    ['name', 'Full Name*'],
                    ['fatherName', "Father's Name*"],
                    ['dateOfBirth', 'Date of Birth*'],
                    ['gender', 'Gender*'],
                    ['bloodGroup', 'Blood Group*'],
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      {field === 'bloodGroup' || field === 'gender' ? (
                        <Field as="select" name={field} className="form-input">
                          <option value="">{`Select ${label.replace('*', '')}`}</option>
                          {(field === 'bloodGroup'
                            ? ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'Ab+', 'Ab-']
                            : ['Male', 'Female', 'Other']
                          ).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Field>
                      ) : (
                        <Field
                          type={field === 'dateOfBirth' ? 'date' : 'text'}
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

              {/* Academic Info */}
              <div className="form-section">
                <h2>Academic Information</h2>
                {/* <div className="form-grid">
                  {[
                    ['rollNo', 'Roll Number*'],
                    ['enrollmentNo', 'Enrollment No*'],
                    ['course', 'Course*'],
                    ['batch', 'Batch*'],
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      {field === 'course' ? (
                        <Field as="select" name={field} className="form-input">
                          <option value="">Select Course</option>
                          {["MCA-5yrs", "MTech (IT)-5yrs","MTech (CS)-5yrs","MBA (MS)-5yrs","MBA (MS)-2yrs"
                            ,"MBA (T)-5yrs","MBA (Eship)","MBA (APR)", "BCom (Hons.)","Phd (Computer)","Pdh (Management)"].map(c => (
                            <option key={c} value={c}>{c}</option>
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
                </div> */}
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

              {/* Contact Info */}
              <div className="form-section">
                <h2>Contact Information</h2>
                <div className="form-grid">
                  {[
                    ['email', 'Email*'],
                    ['contact', 'Phone*'],
                    ['parentContact', "Father's Phone*"],
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      <Field
                        type={field === 'email' ? 'email' : 'tel'}
                        name={field}
                        className="form-input"
                        placeholder={`Enter ${label.replace('*', '')}`}
                      />
                      <ErrorMessage name={field} component="div" className="error-message" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="form-section">
                <h2>Address</h2>
                <div className="form-group full-width">
                  <label>Full Address*</label>
                  <Field as="textarea" name="address" className="form-input" />
                  <ErrorMessage name="address" component="div" className="error-message" />
                </div>
              </div>

              {/* Image Upload */}
              {/* <div className="form-section">
                <h2>Photo Upload</h2>
                <div className="form-group full-width photoupload">
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
                    className="file-input"
                  />
                  <ErrorMessage name="image" component="div" className="error-message" />
                  {uploadError && <div className="error-message">{uploadError}</div>}
             
                </div>
              </div> */}

              <div className="form-section">
                <h2>Document's Upload</h2>
                <div className='imagesection'>
                  {/* Profile Image */}
                  <div className="form-group full-width photoupload">
                    <label>Upload Profile Photo*</label>
                    <input
                      key={formKey + '-image'}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={e => setFieldValue('image', e.currentTarget.files[0])}
                      className="file-input input-img"
                    />
                    <ErrorMessage name="image" component="div" className="error-message" />
                    {values.image && typeof values.image !== 'string' && (
                      <img src={URL.createObjectURL(values.image)} alt="Profile Preview" height={120}  width={'100%'}/>
                    )}
                  </div>

                  {/* Aadhar Image */}
                  <div className="form-group full-width photoupload">
                    <label>Upload Aadhar Card*</label>
                    <input
                      key={formKey + '-aadhar'}
                      type="file"
                      name="aadharImage"
                      accept="image/*"
                      onChange={e => setFieldValue('aadharImage', e.currentTarget.files[0])}
                      className="file-input input-img"
                    />
                    <ErrorMessage name="aadharImage" component="div" className="error-message" />
                    {values.aadharImage && typeof values.aadharImage !== 'string' && (
                      <img src={URL.createObjectURL(values.aadharImage)} alt="Aadhar Preview" height={120} width={'100%'} />
                    )}
                  </div>

                  {/* Admission Slip */}
                  <div className="form-group full-width photoupload">
                    <label>Upload Admission Slip*</label>
                    <input
                      key={formKey + '-slip'}
                      type="file"
                      name="admissionSlip"
                      accept="image/*"
                      onChange={e => setFieldValue('admissionSlip', e.currentTarget.files[0])}
                      className="file-input input-img"
                    />
                    <ErrorMessage name="admissionSlip" component="div" className="error-message" />
                    {values.admissionSlip && typeof values.admissionSlip !== 'string' && (
                      <img src={URL.createObjectURL(values.admissionSlip)} alt="Slip Preview" height={120} width={'100%'} />
                    )}
                  </div>
                </div>
              </div>


              {/* Submit Button */}
              <div className="submit-section">
                <motion.button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
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
