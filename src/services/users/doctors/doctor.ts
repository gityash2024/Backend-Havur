import { Request, Response } from "express";
import { Doctor, Hospital, validateView } from "./_validation";

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.firstName) {
    filter["firstName"] = req.body.firstName;
  }
  if (req.body.lastName) {
    filter["lastName"] = req.body.lastName;
  }
  if (req.body.department) {
    filter["department"] = req.body.department;
  }
  if (req.body.designation) {
    filter["designation"] = req.body.designation;
  }
  if (req.body.emailId) {
    filter["emailId"] = req.body.emailId;
  }
  if (req.body.mobileNumber) {
    filter["mobileNumber"] = req.body.mobileNumber;
  }
  if (req.body.gender) {
    filter["gender"] = req.body.gender;
  }
  if (req.body.city) {
    filter["city"] = req.body.city;
  }

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Doctor.find().countDocuments();
    result.totalRecords = totalRecords;
  }
  result.doctor = await Doctor.find({ $and: [filter] })
    .select({
      password: 0,
      otp: 0,
      status: 0,
      requestType: 0,
      requestStatus: 0,
      hospitalId: 0,
    })
    .sort({
      firstName: 1,
      lastName: 1,
      emailId: 1,
      department: 1,
      designation: 1,
      mobileNumber: 1,
      gender: 1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  let doctorRecord: number = result.doctor.length;
  result.lastPage = doctorRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;

  const doctor: any = await Doctor.findOne({ _id: req.body.did })
    .select({
      password: 0,
      otp: 0,
      status: 0,
      requestType: 0,
      requestStatus: 0,
      hospitalId: 0,
    })
    .sort({
      firstName: 1,
      lastName: 1,
      emailId: 1,
      department: 1,
      designation: 1,
      mobileNumber: 1,
      gender: 1,
    });
  if (!doctor) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: { doctor: doctor },
  });
};

// export const associatedHospitals = async (req: Request, res: Response) => {
//     const { error } = validateView(req.body);
//     if (error) throw error;

//     const doctors = await Doctors.aggregate([
//       {
//         $match: { _id: new Types.ObjectId(req.body.id)}
//       },
//       {
//         $lookup: {
//           from: 'hospital',
//           localField: 'hospitalId._id',
//           foreignField: '_id',
//           as: 'hospitalData'
//         }
//       },
//       { $unwind: '$hospitalData' },
//       {
//         $group: {
//           _id: '$_id',
//           hospitalData: { $push: '$hospitalData' }
//         }
//       }
//     ]);

//     res.status(200).json({
//             data: doctors[0]
//     });

//     }

export const associatedHospitals = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;

  let doctor: any = await Doctor.findOne({ _id: req.body.did });
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.name) {
    filter["name"] = req.body.name;
  }
  if (req.body.emailAddress) {
    filter["emailAddress"] = req.body.emailAddress;
  }
  if (req.body.mobileNumber) {
    filter["mobileNumber"] = req.body.mobileNumber;
  }
  if (req.body.location) {
    filter["location"] = req.body.location;
  }
  let result: any = {};

  const hospitalIds = doctor.hospitalId.map(
    (hospital: { _id: any }) => hospital._id
  );
  result.hospital = await Hospital.find({
    _id: { $in: hospitalIds },
    $and: [filter],
  })
    .select({
      password: 0,
      verificationCode: 0,
      createdAt: 0,
      updatedAt: 0,
      status: 0,
      __v: 0,
    })
    .sort({ name: 1, emailAddress: 1, status: 1 })
    .skip(skip)
    .limit(limit)
    .lean();
  if (pageNo === 1) {
    let totalRecords: number = await Hospital.find({
      _id: { $in: hospitalIds },
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  let hospitalRecord: number = result.hospital.length;
  result.lastPage = hospitalRecord <= recordPerPage ? true : false;

  res.status(200).json({
    data: result,
  });
};
