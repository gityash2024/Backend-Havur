import { Request, Response } from "express";
import {
  Prescriptions,
  PrescriptionsMedicines,
  validateDelete,
} from "./_validation";
import _ from "lodash";

const prescriptionView = async (prescription: any) => {
  prescription = _.pick(prescription, [
    "patientId",
    "doctorId",
    "foodAllergies",
    "tendencyBleed",
    "heartDisease",
    "highBloodPressure",
    "diabetic",
    "surgery",
    "accident",
    "others",
    "currentMedication",
    "femalePregnancy",
    "breastFeeding",
    "healthInsurance",
    "lowIncome",
    "reference",
    "status",
    "plusRate",
    "temperature",
    "problemDescription",
    "test",
    "advice",
    "nextVisitQty",
    "nextVisitTime",
  ]);
  return prescription;
};

export const list = async (req: Request, res: Response) => {
  try {
    // Find all prescription, populate patient details, bill items, and admission details
    const prescription = await Prescriptions.aggregate([
      {
        $lookup: {
          from: "patients", // Link to the correct Admissions collection (check collection name)
          localField: "patientId", // Match patientAdmissionId in the Bill schema
          foreignField: "_id", // _id in the Admissions collection
          as: "patientDetails",
        },
      },
      {
        $lookup: {
          from: "doctor", // Link to the Patients collection
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $lookup: {
          from: "prescriptionsMedicines", // Link to the BillItems collection
          localField: "_id", // Bill ID should match
          foreignField: "prescriptionId",
          as: "prescriptionItem",
        },
      },
      {
        $unwind: {
          path: "$doctorDetails",
          preserveNullAndEmptyArrays: true, // Allow nulls for missing doctors
        },
      },
      {
        $unwind: "$patientDetails",
      },
    ]);

    // Send the response
    res.status(200).json({ data: prescription });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const add = async (req: Request, res: Response) => {
  let prescription: any = new Prescriptions(
    _.pick(req.body, [
      "patientId",
      "doctorId",
      "foodAllergies",
      "tendencyBleed",
      "heartDisease",
      "highBloodPressure",
      "diabetic",
      "surgery",
      "accident",
      "others",
      "currentMedication",
      "femalePregnancy",
      "breastFeeding",
      "healthInsurance",
      "lowIncome",
      "reference",
      "status",
      "plusRate",
      "temperature",
      "problemDescription",
      "test",
      "advice",
      "nextVisitQty",
      "nextVisitTime",
    ])
  );

  prescription.medicalHistory = new Date(req.body.medicalHistory).toISOString();
  prescription.hospitalId = req.body.hid;
  prescription = await prescription.save();

  // Prescription Medicines Add
  let items: any = req.body.items;

  if (items && Array.isArray(items)) {
    items.map(async (item: any) => {
      let prescriptionsMedicine: any = new PrescriptionsMedicines({
        medicine: item.medicine,
        prescriptionId: prescription._id,
        dosage: item.dosage,
        day: item.day,
        time: item.time,
        doseInterval: item.doseInterval,
        comment: item.comment,
      });

      prescriptionsMedicine = await prescriptionsMedicine.save();
    });
  }

  res.status(200).json({ message: "Prescription added successfully." });
};

export const update = async (req: Request, res: Response) => {
  let prescription: any = await Prescriptions.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!prescription)
    return res.status(400).json({ message: "No prescription found." });

  prescription = _.assign(
    prescription,
    _.pick(req.body, [
      "patientId",
      "doctorId",
      "foodAllergies",
      "tendencyBleed",
      "heartDisease",
      "highBloodPressure",
      "diabetic",
      "surgery",
      "accident",
      "others",
      "currentMedication",
      "femalePregnancy",
      "breastFeeding",
      "healthInsurance",
      "lowIncome",
      "reference",
      "status",
      "plusRate",
      "temperature",
      "problemDescription",
      "test",
      "advice",
      "nextVisitQty",
      "nextVisitTime",
    ])
  );

  prescription.medicalHistory = new Date(req.body.medicalHistory).toISOString();
  prescription.hospitalId = req.body.hid;
  prescription.updatedAt = new Date().toISOString();
  prescription = await prescription.save();
  prescription = await prescriptionView(prescription);

  let items: any = req.body.items;

  if (items && Array.isArray(items)) {
    items.map(async (item: any) => {
      if (item._id) {
        let prescriptionsMedicine: any = await PrescriptionsMedicines.findOne({
          _id: item._id,
        });
        prescriptionsMedicine.prescriptionId = item.prescriptionId;
        prescriptionsMedicine.medicine = item.medicine;
        prescriptionsMedicine.dosage = item.dosage;
        prescriptionsMedicine.day = item.day;
        prescriptionsMedicine.time = item.time;
        prescriptionsMedicine.doseInterval = item.doseInterval;
        prescriptionsMedicine.comment = item.comment;
        prescriptionsMedicine.updatedAt = new Date().toISOString();
        prescriptionsMedicine = await prescriptionsMedicine.save();
      } else {
        let prescriptionsMedicine: any = new PrescriptionsMedicines({
          medicine: item.medicine,
          prescriptionId: req.body.id,
          dosage: item.dosage,
          day: item.day,
          time: item.time,
          doseInterval: item.doseInterval,
          comment: item.comment,
        });

        prescriptionsMedicine = await prescriptionsMedicine.save();
      }
    });
  }

  res.status(200).json({ message: "Prescription updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let prescription = await Prescriptions.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!prescription) return res.status(400).json({ message: "No Data Found!" });

  let prescriptionsMedicine: any = await PrescriptionsMedicines.find({
    prescriptionId: prescription._id,
  });
  if (prescriptionsMedicine.length > 0)
    return res
      .status(400)
      .json({ message: "Remove Prescription medicines first." });

  await prescription.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "prescription deleted successfully." });
};

export const removePrescriptionMedicines = async (
  req: Request,
  res: Response
) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let prescriptionsMedicine = await PrescriptionsMedicines.findOne({
    _id: req.body.id,
    prescriptionId: req.body.prescriptionId,
  });
  if (!prescriptionsMedicine)
    return res.status(400).json({ message: "No Data Found!" });

  await PrescriptionsMedicines.deleteOne({
    _id: req.body.id,
    prescriptionId: req.body.prescriptionId,
  });

  res
    .status(200)
    .json({ message: "Prescription medicine deleted successfully." });
};
