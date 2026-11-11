import mongoose from "mongoose";
import Worker from "./models/Worker.js";

const workers = [
  { workerId: "202501", name: "SHANTILAL RAWAT", designation: "SUPERVISOR", basicSalary: 23000 },
  { workerId: "202502", name: "ZAHEER KHAN", designation: "PATTERN MAKER", basicSalary: 30500 },
  { workerId: "202503", name: "VAKHIL AHMED", designation: "FITTER", basicSalary: 23500 },
  { workerId: "202504", name: "KISHANLAL KULMI", designation: "FITTER", basicSalary: 23000 },
  { workerId: "202505", name: "ALLAUDDIN KHAN", designation: "FITTER", basicSalary: 19000 },
  { workerId: "202506", name: "MUMTAAZ SHAIKH", designation: "FITTER", basicSalary: 19000 },
  { workerId: "202507", name: "JAMALUDDIN", designation: "CASTER", basicSalary: 17000 },
  { workerId: "202508", name: "LAXMANSINGH RAWAT", designation: "CASTER", basicSalary: 16000 },
  { workerId: "202509", name: "JITENDRA SHYAMLAL", designation: "CASTER", basicSalary: 13500 },
  { workerId: "202510", name: "BHERULAL KULMI", designation: "CASTER", basicSalary: 13000 },
  { workerId: "202511", name: "SALAUDDIN", designation: "CASTER", basicSalary: 14000 },
  { workerId: "202512", name: "AKHILESH (N)", designation: "HELPER", basicSalary: 12000 },
  { workerId: "202513", name: "SAMEER", designation: "HELPER", basicSalary: 22000 },
  { workerId: "202514", name: "DURGESH KUMAR", designation: "HELPER", basicSalary: 15000 },
  { workerId: "202515", name: "SAQIB", designation: "HELPER", basicSalary: 14000 },
  { workerId: "202516", name: "SUDHEER YADAV", designation: "CASTER (H)", basicSalary: 15000 },
  { workerId: "202517", name: "PANKAJ YADAV", designation: "HELPER", basicSalary: 14000 },
  { workerId: "202518", name: "ACHCHHELAL YADAV", designation: "HELPER", basicSalary: 14000 },
  { workerId: "202519", name: "ARVIND YADAV", designation: "FITTER", basicSalary: 16000 },
  { workerId: "202520", name: "PRINCE YADAV", designation: "HELPER", basicSalary: 13000 },
  { workerId: "202521", name: "SACHIN YADAV", designation: "HELPER", basicSalary: 12000 },
  { workerId: "202522", name: "SOMRAJ", designation: "CASTER", basicSalary: 14000 },
  { workerId: "202523", name: "DHARMARAJ", designation: "HELPER", basicSalary: 2000 },
  { workerId: "202524", name: "PUSHPENDRA", designation: "HELPER", basicSalary: 12000 },
  { workerId: "202525", name: "ABHISHEK THAKKUR", designation: "HELPER", basicSalary: 12000 },
  { workerId: "202526", name: "NIRBHAY THAKKUR", designation: "CASTER", basicSalary: 14000 },
  { workerId: "202527", name: "SHIVRATAN", designation: "HELPER", basicSalary: 12000 },
  { workerId: "202528", name: "KULDEEP YADAV", designation: "HELPER", basicSalary: 14000 },
];

async function seed() {
  await mongoose.connect("mongodb://127.0.0.1:27017/smart_attendance");

  await Worker.deleteMany({});
  await Worker.insertMany(
    workers.map((w) => ({
      ...w,
      password: "12345", // default password
    }))
  );

  console.log("✅ Workers seeded successfully");
  process.exit();
}

seed();
