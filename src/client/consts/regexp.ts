export const REG_EXP = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  tel: /^01[0|1|6|7|8|9]{1}[0-9]{7,8}$/,
  password: /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?=[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,15}$/,
  passwordNum: /[0-9]/g,
  passwordEng: /[a-z]/gi,
  passwordSpe: /[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi,
}

// https://tjddnjs625.tistory.com/28

//
// /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
// 출처: https://tjddnjs625.tistory.com/28 [seong.on2e:티스토리]
