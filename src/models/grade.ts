class Grade {
  lastName: string;
  firstName: string;
  final: number;
  grade: string;

  constructor(params: any) {
    this.lastName = params["Last name"];
    this.firstName = params["First name"];
    this.final = +params["Final"];
    this.grade = params["Grade"];
  }

}

export {
  Grade
}