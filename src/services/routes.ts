import express from "express";
import userLogin from "./users/login/_router";
import {
  doctorAuth,
  patientAuth,
  adminAuth,
  hospitalAuth,
  userAuth,
} from "./../middleware/auth";

import userProfile from "./users/profile/_router";
import doctors from "./users/doctors/_router";
import hospitals from "./users/hospitals/_router";
import appointments from "./users/appointment/_router";
import patientCurrentToken from "./users/currentToken/_router";
import patientFolder from "./users/Folders/_router";
import patientSchedule from "./users/schedule/_router";

import adminLogin from "./admin/login/_router";
import adminHospital from "./admin/hospital/_router";
import adminProfile from "./admin/profile/_router";

import doctorLogin from "./doctor/login/_router";
import appointmentsList from "./doctor/appointment/_router";
import doctorProfile from "./doctor/profile/_router";
import doctorHospital from "./doctor/hospital/_router";
import doctorOpdPatient from "./doctor/opdPatient/_router";
import doctorIpdPatient from "./doctor/ipdPatient/_router";
import doctorBedType from "./doctor/bedType/_router";
import doctorBed from "./doctor/bed/_router";
import doctorPatient from "./doctor/patient/_router";
import doctorAdmission from "./doctor/admission/_router";
import doctorPatientCase from "./doctor/case/_router";
import doctorList from "./doctor/doctor/_router";
import doctorTokenNo from "./doctor/tokenNo/_router";
import doctorSpecialization from "./doctor/specialization/_router";
import doctorDepartment from "./doctor/department/_router";
import doctorQualification from "./doctor/qualification/_router";
import doctorSchedule from "./doctor/schedule/_router";
import doctorHolidays from "./doctor/holidays/_router";

import hospitalLogin from "./hospital/login/_router";
import hospitalProfile from "./hospital/profile/_router";
import hospitalAppointment from "./hospital/appointment/_router";
import hospitalPatient from "./hospital/patient/_router";
import hospitalDoctor from "./hospital/doctor/_router";
import hospitalAdmission from "./hospital/admission/_router";
import hospitalPatientCase from "./hospital/patientCase/_router";
import hospitalBedType from "./hospital/bedType/_router";
import hospitalBed from "./hospital/bed/_router";
import hospitalOpdPatient from "./hospital/opdPatient/_router";
import hospitalIpdPatient from "./hospital/ipdPatient/_router";
import hospitalCaseHandler from "./hospital/caseHandler/_router";
import hospitalBedAssign from "./hospital/bedAssign/_router";
import hospitalSpecialization from "./hospital/specialization/_router";
import hospitalDepartment from "./hospital/department/_router";
import hospitalQualification from "./hospital/qualification/_router";
import hospitalReceptionist from "./hospital/receptionist/_router";
import hospitalAccounts from "./hospital/accounts/_router";
import hospitalAppointmentTransactions from "./hospital/appointmentTransaction/_router";
import hospitalBills from "./hospital/bills/_router";
import hospitalPayments from "./hospital/payments/_router";
import hospitalAdvancePayments from "./hospital/advancePayment/_router";
import hospitalInvoices from "./hospital/invoices/_router";
import hospitalPrescription from "./hospital/prescriptions/_router";
import webAppointmentsList from "./doctorWeb/appointment/_router";
import webDoctorList from "./doctorWeb/doctor/_router";
import webDoctorPatient from "./doctorWeb/patient/_router";
import webDoctorAdmission from "./doctorWeb/admission/_router";
import webDoctorOpdPatient from "./doctorWeb/opdPatient/_router";
import webDoctorIpdPatient from "./doctorWeb/ipdPatient/_router";
import webPrescription from "./doctorWeb/prescriptions/_router";

import receptionistLogin from "./receptionist/login/_router";
import receptionistProfile from "./receptionist/profile/_router";

const app = express();

app.use("/doctor", doctorLogin);
app.use("/doctor/profile", doctorAuth, doctorProfile);
app.use("/doctor/d", doctorAuth, doctorList);
app.use("/doctor/hospital", doctorAuth, doctorHospital);
app.use("/doctor/patient", doctorAuth, doctorPatient);
app.use("/doctor/patient/admission", doctorAuth, doctorAdmission);
app.use("/doctor/appointment", doctorAuth, appointmentsList);
app.use("/doctor/opd_patient", doctorAuth, doctorOpdPatient);
app.use("/doctor/ipd_patient", doctorAuth, doctorIpdPatient);
app.use("/doctor/bed_type", doctorAuth, doctorBedType);
app.use("/doctor/bed", doctorAuth, doctorBed);
app.use("/doctor/patient/case", doctorAuth, doctorPatientCase);
app.use("/doctor/token", doctorAuth, doctorTokenNo);
app.use("/doctor/specialization", doctorAuth, doctorSpecialization);
app.use("/doctor/department", doctorAuth, doctorDepartment);
app.use("/doctor/qualification", doctorAuth, doctorQualification);
app.use("/doctor/schedule", doctorAuth, doctorSchedule);
app.use("/doctor/holidays", doctorAuth, doctorHolidays);

app.use("/patient", userLogin);
app.use("/patient/profile", patientAuth, userProfile);
app.use("/patient/doctor", patientAuth, doctors);
app.use("/patient/hospital", patientAuth, hospitals);
app.use("/patient/appointment", patientAuth, appointments);
app.use("/patient/current", patientAuth, patientCurrentToken);
app.use("/patient/folder", patientAuth, patientFolder);
app.use("/patient/schedule", patientAuth, patientSchedule);

app.use("/hospital", hospitalLogin);
app.use("/hospital/doctor", hospitalAuth, hospitalDoctor);
app.use("/hospital/patient", hospitalAuth, hospitalPatient);
app.use("/hospital/profile", hospitalAuth, hospitalProfile);
app.use("/hospital/appointment", hospitalAuth, hospitalAppointment);
app.use("/hospital/admission", hospitalAuth, hospitalAdmission);
app.use("/hospital/patient/case", hospitalAuth, hospitalPatientCase);
app.use("/hospital/patient/caseHandler", hospitalAuth, hospitalCaseHandler);
app.use("/hospital/bed_type", hospitalAuth, hospitalBedType);
app.use("/hospital/bed", hospitalAuth, hospitalBed);
app.use("/hospital/bed_assign", hospitalAuth, hospitalBedAssign);
app.use("/hospital/opd_patient", hospitalAuth, hospitalOpdPatient);
app.use("/hospital/ipd_patient", hospitalAuth, hospitalIpdPatient);
app.use("/hospital/specialization", hospitalAuth, hospitalSpecialization);
app.use("/hospital/department", hospitalAuth, hospitalDepartment);
app.use("/hospital/qualification", hospitalAuth, hospitalQualification);
app.use("/hospital/receptionist", hospitalAuth, hospitalReceptionist);
app.use("/hospital/accounts", hospitalAuth, hospitalAccounts);
app.use(
  "/hospital/appointment-transaction",
  hospitalAuth,
  hospitalAppointmentTransactions
);
app.use("/hospital/bills", hospitalAuth, hospitalBills);
app.use("/hospital/payments", hospitalAuth, hospitalPayments);
app.use("/hospital/advance-payments", hospitalAuth, hospitalAdvancePayments);
app.use("/hospital/invoices", hospitalAuth, hospitalInvoices);
app.use("/hospital/prescription", hospitalAuth, hospitalPrescription);

app.use("/admin", adminLogin);
app.use("/admin/hospital", adminAuth, adminHospital);
app.use("/admin/profile", adminAuth, adminProfile);

app.use("/users", receptionistLogin);
app.use("/users/profile", userAuth, receptionistProfile);

// web
app.use("/web/appointment", doctorAuth, webAppointmentsList);
app.use("/web/doctor", doctorAuth, webDoctorList);
app.use("/web/patient", doctorAuth, webDoctorPatient);
app.use("/web/patient/admission", doctorAuth, webDoctorAdmission);
app.use("/web/opd_patient", doctorAuth, webDoctorOpdPatient);
app.use("/web/ipd_patient", doctorAuth, webDoctorIpdPatient);
app.use("/web/prescription", doctorAuth, webPrescription);

export default app;
