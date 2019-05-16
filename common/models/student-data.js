module.exports = function(StudentData) {
  StudentData.login = function(userDetails) {
    return new Promise(async (resolve, reject) => {
      try {
        let userData = await StudentData.find({
          where: {
            sId: userDetails.userId
          }
        });
        if (!userData.length <= 0) {
          let passName = userDetails.password.split('@')[0];
          let passid = userDetails.password.split('@')[1];
          let userIdLength = userData[0].sId.toString().length;
          if (userData[0].sFname.substring(0, 3).toLowerCase() == passName.toLowerCase() && userData[0].sId.toString().substring(userIdLength - 3, userIdLength) == passid) {
            resolve({
              status: 200,
              data: userData[0]
            });
          } else {
            reject({
              status: 400,
              errorMessage: 'not an authorised user'
            });
          }
        } else {
          reject({
            status: 400,
            errorMessage: 'not an authorised user'
          });
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  };

  StudentData.getRecomendationsTable = function(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let getRecomendationsTable = `exec get_recommendations ${userId}`;
        let data = await getDataFromDb(getRecomendationsTable);
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(errorHandler('internal server error', 'error trying to fetch data for recomendations', 500));
      }
    });
  };

  StudentData.getOtherAvailCoursesTable = function(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let getOtherAvailCoursesTable = `exec get_other_avail_courses ${userId}`;
        let data = await getDataFromDb(getOtherAvailCoursesTable);
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(errorHandler('internal server error', 'error trying to fetch data for recomendations', 500));
      }
    });
  };

  StudentData.getCoursesCompletedTable = function(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let getCoursesCompletedTable = `select c_id as cId, c_name as cName, c_semester as cSemester, c_grade as cGrade, c_status as cStatus from student_past_data where s_id = ${userId}`;
        let data = await getDataFromDb(getCoursesCompletedTable);
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(errorHandler('internal server error', 'error trying to fetch data for recomendations', 500));
      }
    });
  };

  function errorHandler(name, reason, status) {
    const error = new Error(`${name}: ${reason}`);
    error.name = name;
    error.status = status;
    return error;
  }

  function getDataFromDb(script) {
    return new Promise((resolve, reject) => {
      const conn = StudentData.app.dataSources.CRS_DB.connector;
      conn.query(script, function(err, returndata) {
        if (err) {
          console.error('Error Trying to fetch Data From Database' + JSON.stringify(err));
          let error = new Error(`Internal Server Error: Error Trying to fetch Data From Database`);
          error.status = 500;
          reject(error);
        } else {
          resolve(returndata);
        }
      });
    });
  }

  StudentData.remoteMethod('getRecomendationsTable', {
    accepts: [
      {
        arg: 'userId',
        type: 'number',
        required: true
      }
    ],
    returns: [
      {
        arg: 'studentData',
        type: 'object'
      }
    ],
    http: {
      path: '/getRecomendationsTable/:userId',
      verb: 'get'
    },
    description: 'get Recomendations Table for the user'
  });

  StudentData.remoteMethod('getOtherAvailCoursesTable', {
    accepts: [
      {
        arg: 'userId',
        type: 'number',
        required: true
      }
    ],
    returns: [
      {
        arg: 'studentData',
        type: 'object'
      }
    ],
    http: {
      path: '/getOtherAvailCoursesTable/:userId',
      verb: 'get'
    },
    description: 'get Other Available Courses Table for the user'
  });

  StudentData.remoteMethod('getCoursesCompletedTable', {
    accepts: [
      {
        arg: 'userId',
        type: 'number',
        required: true
      }
    ],
    returns: [
      {
        arg: 'studentData',
        type: 'object'
      }
    ],
    http: {
      path: '/getCoursesCompletedTable/:userId',
      verb: 'get'
    },
    description: 'get Courses Completed Table for the user'
  });

  StudentData.remoteMethod('login', {
    accepts: [
      {
        arg: 'userDetails',
        type: 'object',
        required: true,
        http: {
          source: 'body'
        }
      }
    ],
    returns: [
      {
        arg: 'studentData',
        type: 'object'
      }
    ],
    http: {
      path: '/login',
      verb: 'post'
    },
    description: 'login the user'
  });
};
