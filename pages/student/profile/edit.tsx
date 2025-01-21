import {
  Autocomplete,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Meta from "@components/Meta";
import studentRequest, { Student } from "@callbacks/student/student";
import useStore from "@store/store";
import { Branches, StagesofPhD, func } from "@components/Utils/matrixUtils";
import { getId } from "@components/Parser/parser";

function ProfileEdit() {
  const [StudentData, setStudentData] = useState<Student>({ ID: 0 } as Student);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm<Student>({
    defaultValues: StudentData,
  });
  const watchGender = watch("gender");
  const watchDisability = watch("disability");

  const [dept, setDept] = useState<any>("");
  // const [deptSec, setDeptSec] = useState<any>("");

  const { token } = useStore();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const student = await studentRequest
        .get(token)
        .catch(() => ({ ID: 0 } as Student));

      setStudentData(student);
      reset({
        name: student.name,
        iitk_email: student.iitk_email,
        roll_no: student.roll_no,
        specialization: student.specialization,
        program: student.program,
        department: student.department,
        gender: student.gender,
        personal_email: student.personal_email,
        dob: student.dob,
        phone: student.phone,
        alternate_phone: student.alternate_phone,
        whatsapp_number: student.whatsapp_number,
        current_cpi: student.current_cpi,
        ug_cpi: student.current_cpi,
        tenth_board: student.tenth_board,
        tenth_year: student.tenth_year,
        tenth_marks: student.tenth_marks,
        twelfth_board: student.twelfth_board,
        twelfth_marks: student.twelfth_marks,
        twelfth_year: student.twelfth_year,
        current_address: student.current_address,
        permanent_address: student.permanent_address,
        friend_name: student.friend_name,
        friend_phone: student.friend_phone,
        disability: student.disability,
      });
    };
    fetch();
  }, [token, reset]);

  const onSubmit = async (data: Student) => {
    let program_department_id = getId(
      getValues("program"),
      getValues("department")
    );

    let secondary_program_department_id = getId(
      getValues("program_2"),
      getValues("department_2")
    );

    if (secondary_program_department_id === 200)
      secondary_program_department_id = 0;

    const response = await studentRequest.update(token, {
      ...data,
      program_department_id,
      secondary_program_department_id,
    });

    if (response) {
      router.push("/student/profile");
    }
  };
  return (
    <div>
      <Meta title="Edit Profile - Student Dashboard " />
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <h2>Edit Profile</h2>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{ width: 100 }}
            >
              Save
            </Button>

            <Button
              variant="contained"
              sx={{ width: 150 }}
              color={StudentData.is_verified ? "success" : "error"}
            >
              {StudentData.is_verified === true ? "Verified" : "Not Verified"}
            </Button>
          </Stack>
        </Stack>
        <h3 style={{ fontWeight: 300 }}>
          Please fill in corresponding details <b>only</b> for the fields you
          want to edit.
        </h3>
        <h4 style={{ fontWeight: 300 }}>
          PS. If your profile is already verified, it will be reverted upon any
          change.
        </h4>
        <h4 style={{ fontWeight: 500 }}>
          Already verified students registering for the new placement season can
          edit some of the allowed fields below
        </h4>
        <h4 style={{ fontWeight: 500 }}>
          It is mandatory to fill the Stages of PhD field in order to be
          registered for the recruitment cycle
        </h4>
        <form style={{ marginBottom: 10 }}>
          <Stack justifyContent="center">
            <Card
              elevation={5}
              sx={{
                padding: 3,
                borderRadius: "10px",
                width: { xs: "330px", sm: "600px", margin: "0px auto" },
              }}
            >
              <Grid container spacing={5} sx={{ padding: 3 }}>
                <Grid item xs={12} sm={6}>
                  <p>Name</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>IITK Email</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    disabled
                    {...register("iitk_email")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>IITK Roll No.</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    disabled
                    {...register("roll_no")}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <p>Expected Year of Graduation</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.expected_graduation_year}
                    helperText={
                      errors.expected_graduation_year
                        ? "Year doesnt lie in required range!"
                        : ""
                    }
                    {...register("expected_graduation_year", {
                      setValueAs: (value) => parseInt(value, 10),
                      max: 9999,
                      min: 1000,
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLTextAreaElement).blur()
                    }
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <p>Department</p>
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={!!errors.department}
                  >
                    <Select
                      {...register("department", {
                        required: "Department is required",
                      })}
                      onChange={(e) => setDept(e.target.value)}
                    >
                      <MenuItem value="" />
                      <MenuItem value="NA">None</MenuItem>
                      {Branches.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.department && (
                      <FormHelperText>
                        {errors.department.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={!!errors.program}
                  >
                    <p>Program</p>
                    {dept !== "" ? (
                      <Autocomplete
                        freeSolo
                        options={Object.keys(
                          func[dept as keyof typeof func] || []
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...register("program", {
                              required: "Program is required",
                            })}
                            label="Program"
                            variant="standard"
                          />
                        )}
                        onChange={(_, value) => {
                          // Manually set the value when a predefined option is selected
                          setValue("program", value || "", {
                            shouldValidate: true,
                          });
                        }}
                        onInputChange={(_, value) => {
                          // Update the value as the user types
                          setValue("program", value, { shouldValidate: true });
                        }}
                      />
                    ) : (
                      <TextField
                        {...register("program", {
                          required: "Program is required",
                        })}
                        label="Program"
                        variant="standard"
                      />
                    )}
                    {errors.program && (
                      <FormHelperText>{errors.program.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Stage of PhD</p>
                  <Select
                    fullWidth
                    variant="standard"
                    required
                    {...register("specialization", {
                      required: "Stage of PhD is required",
                    })}
                    // onChange={(e) => {
                    //   setDept(e.target.value as string);
                    // }}
                  >
                    <MenuItem value="" />
                    {/* <MenuItem value="NA">None</MenuItem> */}
                    {StagesofPhD.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Gender</p>
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={!!errors.gender}
                  >
                    <Select
                      value={watchGender || ""}
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    >
                      <MenuItem value="" />
                      <MenuItem value="NA">None</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                    {errors.gender && (
                      <FormHelperText>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Personal Email</p>
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={!!errors.personal_email}
                  >
                    <TextField
                      type="text"
                      id="standard-basic"
                      variant="standard"
                      {...register("personal_email", {
                        required: "Personal Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                      error={!!errors.personal_email}
                    />
                    {errors.personal_email && (
                      <FormHelperText>
                        {errors.personal_email.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Date Of Birth</p>
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={!!errors.dob}
                  >
                    <TextField
                      type="date"
                      id="standard-basic"
                      variant="standard"
                      {...register("dob", {
                        required: "Date of Birth is required",
                        setValueAs: (date) => {
                          const d = new Date(date);
                          return d.getTime(); // Convert to epoch time
                        },
                      })}
                      error={!!errors.dob}
                    />
                    {errors.dob && (
                      <FormHelperText>{errors.dob.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Contact Number</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.phone}
                    helperText={
                      errors.phone ? "Contact No. must contain 10 digits!" : ""
                    }
                    {...register("phone", {
                      minLength: 10,
                      maxLength: 10,
                      required: "Contact Number is required",
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Alternate Contact Number</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.alternate_phone}
                    helperText={
                      errors.phone
                        ? "Alternate Contact No. must contain 10 digits!"
                        : ""
                    }
                    {...register("alternate_phone", {
                      minLength: 10,
                      maxLength: 10,
                      required: "Alternate Contact Number is required",
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Whatsapp Number</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.whatsapp_number}
                    helperText={
                      errors.phone
                        ? "Whatsapp Contact No. must contain 10 digits!"
                        : ""
                    }
                    {...register("whatsapp_number", {
                      minLength: 10,
                      maxLength: 10,
                      required: "Whatsapp Number is required",
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Current CPI</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="current-cpi"
                    variant="standard"
                    error={!!errors.current_cpi}
                    helperText={errors.current_cpi?.message}
                    {...register("current_cpi", {
                      required: "Current CPI is required",
                      validate: (value) =>
                        !Number.isNaN(parseFloat(value.toString())) ||
                        "Please enter a valid number",
                      setValueAs: (value) => parseFloat(value),
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>PG CPI</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="pg-cpi"
                    variant="standard"
                    error={!!errors.ug_cpi}
                    helperText={errors.ug_cpi?.message}
                    {...register("ug_cpi", {
                      required: "PG CPI is required",
                      validate: (value) =>
                        !Number.isNaN(parseFloat(value.toString())) ||
                        "Please enter a valid number",
                      setValueAs: (value) => parseFloat(value),
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>10th Board</p>
                  <Autocomplete
                    freeSolo
                    options={["CBSE", "ICSE"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        error={!!errors.tenth_board}
                        helperText={
                          errors.tenth_board ? errors.tenth_board.message : ""
                        }
                        {...register("tenth_board", {
                          required: "10th Board is required",
                          validate: (value) =>
                            value.trim() !== "" || "10th Board is required",
                        })}
                      />
                    )}
                    onChange={(_, value) => {
                      // Update the field value when an option is selected
                      setValue("tenth_board", value || "", {
                        shouldValidate: true,
                      });
                    }}
                    inputValue={watch("tenth_board")} // Keep input value in sync with the form state
                    onInputChange={(_, value) => {
                      // Update the field value as the user types
                      setValue("tenth_board", value || "", {
                        shouldValidate: true,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>10th Board Year</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="tenth-board-year"
                    variant="standard"
                    error={!!errors.tenth_year}
                    helperText={errors.tenth_year?.message}
                    {...register("tenth_year", {
                      required: "10th Board Year is required",
                      setValueAs: (value) => parseInt(value, 10),
                      validate: (value) =>
                        (value >= 1000 && value <= 9999) ||
                        "Year must be between 1000 and 9999",
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLInputElement).blur()
                    } // Prevent number scrolling
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>10th Marks (CGPA / Percentage)</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="tenth-marks"
                    variant="standard"
                    error={!!errors.tenth_marks}
                    helperText={errors.tenth_marks?.message}
                    {...register("tenth_marks", {
                      required: "10th Marks are required",
                      setValueAs: (value) => parseFloat(value),
                      validate: (value) => {
                        const marks = parseFloat(value.toString());
                        if (Number.isNaN(marks))
                          return "Marks must be a valid number";
                        if (marks < 0) return "Marks must be at least 0";
                        if (marks > 100) return "Marks cannot exceed 100";
                        return true;
                      },
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>12th Board</p>
                  <Autocomplete
                    freeSolo
                    options={["CBSE", "ICSE"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        error={!!errors.twelfth_board}
                        helperText={
                          errors.twelfth_board
                            ? errors.twelfth_board.message
                            : ""
                        }
                        {...register("twelfth_board", {
                          required: "12th Board is required",
                          validate: (value) =>
                            value.trim() !== "" || "12th Board is required",
                        })}
                      />
                    )}
                    onChange={(_, value) => {
                      // Update the field value when an option is selected
                      setValue("twelfth_board", value || "", {
                        shouldValidate: true,
                      });
                    }}
                    inputValue={watch("twelfth_board")} // Keep input value in sync with the form state
                    onInputChange={(_, value) => {
                      // Update the field value as the user types
                      setValue("twelfth_board", value || "", {
                        shouldValidate: true,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>12th Board Year</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="twelfth-board-year"
                    variant="standard"
                    error={!!errors.twelfth_year}
                    helperText={errors.twelfth_year?.message}
                    {...register("twelfth_year", {
                      required: "12th Board Year is required",
                      setValueAs: (value) => parseInt(value, 10),
                      validate: (value) =>
                        (value >= 1000 && value <= 9999) ||
                        "Year must be between 1000 and 9999",
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLInputElement).blur()
                    } // Prevent scrolling
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>12th Marks (CGPA / Percentage)</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="twelfth-marks"
                    variant="standard"
                    error={!!errors.twelfth_marks}
                    helperText={errors.twelfth_marks?.message}
                    {...register("twelfth_marks", {
                      required: "12th Marks are required",
                      setValueAs: (value) => parseFloat(value),
                      validate: (value) => {
                        const marks = parseFloat(value.toString());
                        if (Number.isNaN(marks))
                          return "Marks must be a valid number";
                        if (marks < 0) return "Marks must be at least 0";
                        if (marks > 100) return "Marks cannot exceed 100";
                        return true;
                      },
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Current Address</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    multiline
                    minRows={3}
                    {...register("current_address", {
                      required: "Current Address is required",
                    })}
                    error={!!errors.current_address}
                    helperText={
                      errors.current_address
                        ? errors.current_address.message
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Permanent Address</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    multiline
                    minRows={3}
                    {...register("permanent_address", {
                      required: "Permanent Address is required",
                    })}
                    error={!!errors.permanent_address}
                    helperText={
                      errors.permanent_address
                        ? errors.permanent_address.message
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Friend Name</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("friend_name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Friend Contact Details</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    error={!!errors.friend_phone}
                    helperText={
                      errors.friend_phone
                        ? "Contact number must be 10 digits long!"
                        : ""
                    }
                    variant="standard"
                    {...register("friend_phone", {
                      minLength: 10,
                      maxLength: 10,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Disability</p>
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={!!errors.disability}
                  >
                    <Select
                      value={watchDisability || "No"}
                      {...register("disability", {
                        required: "Disability is required",
                      })}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                    {errors.disability && (
                      <FormHelperText>
                        {errors.disability.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </form>
      </Stack>
    </div>
  );
}

ProfileEdit.layout = "studentDashboard";
export default ProfileEdit;
