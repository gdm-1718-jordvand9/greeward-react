module.exports = {
  'database': {
    'connectionString': 'mongodb://mobdev2:wickedman@ds111754.mlab.com:11754/mobdev2-jordvand9'
  },
  'auth': {
    'bcrypt': {
      'SALT_WORK_FACTOR': 10
    },
    'jwtSecret': 'mobdev2_nmd_gdm',
    'jwtSession': {
        session: false
    },
    'facebook': {
      'clientID': '1965509600152270',
      'clientSecret': '395e254cfe3c57a9bf65fef81c102e3f'
    }
  }  
};