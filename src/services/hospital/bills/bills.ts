import { Request, Response } from "express";
import {
  BillItems,
  Bills,
  BillTransaction,
  validateAdd,
  validateDelete,
} from "./_validation";
import _ from "lodash";
import generateAutoID from "../../../helper/autoGenerate";

const billsView = async (bed: any) => {
  bed = _.pick(bed, [
    "billId",
    "patientId",
    "billDate",
    "amount",
    "status",
    "patientAdmissionId",
    "hospitalId",
  ]);
  return bed;
};

export const list = async (req: Request, res: Response) => {
  try {
    // Find all bills, populate patient details, bill items, and admission details
    const bills = await Bills.aggregate([
      {
        $lookup: {
          from: "admission", // Link to the correct Admissions collection (check collection name)
          localField: "patientAdmissionId", // Match patientAdmissionId in the Bill schema
          foreignField: "_id", // _id in the Admissions collection
          as: "admissionDetails",
        },
      },
      {
        $lookup: {
          from: "patients", // Link to the Patients collection
          localField: "patientId",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $lookup: {
          from: "billItems", // Link to the BillItems collection
          localField: "_id", // Bill ID should match
          foreignField: "billId",
          as: "billItems",
        },
      },
      {
        $unwind: {
          path: "$admissionDetails",
          preserveNullAndEmptyArrays: true, // Ensure nulls are allowed when no admission record exists
        },
      },
      {
        $lookup: {
          from: "doctor", // Link to the Doctors collection
          localField: "admissionDetails.doctorId", // Match doctorId from admissionDetails
          foreignField: "_id",
          as: "doctorDetails",
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
    res.status(200).json({ data: bills });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let bills: any = new Bills(
    _.pick(req.body, ["patientId", "amount", "status", "patientAdmissionId"])
  );

  bills.billDate = new Date(req.body.billDate).toISOString();
  bills.billId = generateAutoID(8);
  bills.hospitalId = req.body.hid;
  bills = await bills.save();

  // Bills Item Add
  let items: any = req.body.items;

  if (items && Array.isArray(items)) {
    items.map(async (item: any) => {
      let billsItem: any = new BillItems({
        itemName: item.name,
        billId: bills._id,
        qty: item.qty,
        price: item.price,
        amount: item.amount,
      });

      billsItem = await billsItem.save();
    });
  }

  // if Bill status was paid then add a bill transaction
  if (bills.status === "Paid") {
    let billTransaction: any = new BillTransaction({
      transactionId: generateAutoID(6),
      paymentType: "cash",
      amount: bills.amount,
      billId: bills._id,
      patientId: bills.patientId,
      status: "Paid",
      isManualPayment: "Yes",
      hospitalId: req.body.hid,
    });

    billTransaction = await billTransaction.save();
  }

  res.status(200).json({ message: "Bill added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let bills: any = await Bills.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bills) return res.status(400).json({ message: "No bills found." });

  bills = _.assign(
    bills,
    _.pick(req.body, [
      "patientId",
      "billDate",
      "amount",
      "status",
      "patientAdmissionId",
    ])
  );

  bills.hospitalId = req.body.hid;
  bills.updatedAt = new Date().toISOString();
  bills = await bills.save();
  bills = await billsView(bills);

  let items: any = req.body.items;

  if (items && Array.isArray(items)) {
    items.map(async (item: any) => {
      if (item._id) {
        let billItems: any = await BillItems.findOne({ _id: item._id });
        billItems.itemsName = item.name;
        billItems.billId = item.billId;
        billItems.qty = item.qty;
        billItems.price = item.price;
        billItems.amount = item.amount;
        billItems.updatedAt = new Date().toISOString();
        billItems = await billItems.save();
      } else {
        let billsItem: any = new BillItems({
          itemName: item.name,
          billId: req.body.id,
          qty: item.qty,
          price: item.price,
          amount: item.amount,
        });

        billsItem = await billsItem.save();
      }
    });
  }

  if (bills.status === "Paid") {
    let billTransaction: any = new BillTransaction({
      transactionId: generateAutoID(6),
      paymentType: "cash",
      amount: bills.amount,
      billId: bills._id,
      patientId: bills.patientId,
      status: "Paid",
      isManualPayment: "Yes",
      hospitalId: req.body.hid,
    });

    billTransaction = await billTransaction.save();
  }

  res.status(200).json({ message: "Bill updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let bills = await Bills.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bills) return res.status(400).json({ message: "No Data Found!" });

  let billItem: any = await BillItems.find({ billId: bills._id });
  if (billItem.length > 0)
    return res.status(400).json({ message: "Remove Bill Items first." });

  await Bills.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Bills deleted successfully." });
};

export const removeBillItems = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let bills = await BillItems.findOne({
    _id: req.body.id,
    billId: req.body.billId,
  });
  if (!bills) return res.status(400).json({ message: "No Data Found!" });

  await BillItems.deleteOne({
    _id: req.body.id,
    billId: req.body.billId,
  });

  res.status(200).json({ message: "Bill Item deleted successfully." });
};

export const billTransactionList = async (req: Request, res: Response) => {
  const billTransaction = await BillTransaction.find({
    hospitalId: req.body.hid,
  })
    .populate("patientId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
    })
    .populate("billId", {
      billId: 1,
      billDate: 1,
      billStatus: 1,
    })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: billTransaction });
};
