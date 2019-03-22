module.exports = function (StudentData) {
  StudentData.login = function (userDetails) {
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
          if ((userData[0].sFname.substring(0, 3).toLowerCase() == passName.toLowerCase()) && (userData[0].sId.toString().substring(userIdLength - 3, userIdLength) == passid)) {
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
        reject(err)
      }
    });
  };
  StudentData.remoteMethod('login', {
    accepts: [{
      arg: 'userDetails',
      type: 'object',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'studentData',
      type: 'object'
    }],
    http: {
      path: '/login',
      verb: 'post'
    },
    description: 'login the user'
  });
};
