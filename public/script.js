const submitFunc = async () => {
  // let username = document.getElementById("username");
  // let password = document.getElementById("password");
  let firstId = document.getElementById("firstId");
  let total = document.getElementById("total");
  let faculty = document.getElementById("faculty");
  let k = document.getElementById("k");
  let semester = document.getElementById("semester");

  // let name = document.getElementById("name");
  // let value = document.getElementById("value");

  console.log(
    firstId.value,
    total.value,
    faculty.value,
    k.value,
    semester.value
  );

  if (
    faculty.value != "" &&
    firstId.value != "" &&
    total.value != "" &&
    k.value != "" &&
    semester.value != ""
  ) {
    let f = faculty.options[faculty.selectedIndex].text;
    let result = await axios({
      url: "/refresh-data",
      method: "POST",
      data: {
        username: "admin", // if u are a dev, u find this, pls dont try to attack. I make this for public
        password: "123", // // if u are a dev, u find this, pls dont try to attack. I make this for public
        firstId: firstId.value,
        total: total.value,
        name: `Ngành ${f} - ${k.value} - ${semester.value}`,
        value: `nganh_${faculty.value}_${k.value}_${semester.value}`,
      },
    });

    try {
      if (result.data.success === false) {
        toastr.error(result.data.error, "Error");
      } else {
        toastr.success("Reload lại trang");
      }
    } catch (error) {
      printError();
    }
  } else toastr.error("Xin bạn check lại dữ liệu đã bị sai", "Error");
};

const printError = () => {
  toastr.error("Ôi mình code sai gì rồi", "Error!");
};

window.onload = function () {
  console.log("Please dont try to attack. This app just helps students.Thanks");
  console.log("Please dont try to attack. This app just helps students.Thanks");
  console.log("Please dont try to attack. This app just helps students.Thanks");
  console.log("Please dont try to attack. This app just helps students.Thanks");
  console.log("Please dont try to attack. This app just helps students.Thanks");
  console.log(
    "Contact to dev: https://www.facebook.com/profile.php?id=100010765894081"
  );
};
