let IsAyeAyeSetup = false;
let Apis = [];

export const LOG_LEVELS = {
   DEBUG: 1,
   INFO: 2,
   WARNING: 3,
   ERROR: 4
};

const LogLevelMaxForSucceed = LOG_LEVELS.INFO;

const DATA_REQUIRED = ['path', 'method', 'function'];

export const Setup = (apis) => {
   if (!Array.isArray(apis) || apis.length <= 0) {
      //TODO: Use logging logic here
      console.error(
         'Please provide a set of APIs to handle, what you gave me makes no sense.'
      );
      return;
   }

   let apisValid = true;
   let apiFailureMessage = '';

   let apisWithRegex = apis.map((api) => {
      let apiKeys = Object.keys(api);
      let paramValidation =
         DATA_REQUIRED.filter((dataRequired) => {
            return !apiKeys.contains(dataRequired);
         }) || [];

      if (paramValidation.length > 0) {
         apiFailureMessage += `Missing Fields for (${
            api.path || 'Unknown Path'
         }): ${paramValidation.join(', ')}\n`;
      }

      let regex = api.regex || '';

      if (regex.length <= 0) {
         let parts = api.path.split('/');

         let regexTemp = parts.map((part) => {
            return part.length > 0 ? (part.includes(':') ? ':w+' : 'w+') : '';
         });

         regex = regexTemp.join('/');
      }

      return { ...api, regex: new RegExp(regex) };
   });

   if (apisValid) {
      Apis = apis;
      IsAyeAyeSetup = true;
   } else {
      //TODO: Use logging logic here
      console.error(apiFailureMessage);
   }
};

const Handle = (path, method, headers) => {
   let api =
      Apis.find((api) => api.method === method && api.regex.test(path)) || null;

   if (api === null) {
      //TODO: Use logging logic here
      throw 'API Not Found';
   }

   api.function(path, method, headers);
};

export default Handle;
