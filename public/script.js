const submitFunc = async () => {
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let firstId = document.getElementById("firstId");
  let type = document.getElementById("type");
  let total = document.getElementById("total");
  let name = document.getElementById("name");
  let value = document.getElementById("value");

  if (username && password && firstId && total && name && value) {
    let result = await axios({
      url: "/refresh-data",
      method: "POST",
      data: {
        username: username.value,
        password: password.value,
        firstId: firstId.value,
        total: total.value,
        name: name.value,
        value: value.value
      },
    });

    try {
      if (result.data.success === false) {
        toastr.error(result.data.error,'Error')
      }else{
        toastr.success('Reload lại trang')
      }
    } catch (error) {
      printError();
    }
  }
};

const printError = () => {
  toastr.error("Ôi mình code sai gì rồi", "Error!");
};
