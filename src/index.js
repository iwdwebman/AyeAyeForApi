const PACKAGE_NAME = 'AyeAyeForApi:: ';

let IsAyeAyeSetup = false;
let Apis = [];

let Logger = console.error;

export const SetLogger = (logger) => {
   if (typeof logger === 'function') {
      Logger = logger;
   } else {
      logger(PACKAGE_NAME + 'Expected Function for Setting Logger');
   }
};

const DATA_REQUIRED = ['path', 'method', 'function'];

export const Setup = (apis) => {
   if (!Array.isArray(apis) || apis.length <= 0) {
      Logger(
         PACKAGE_NAME +
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

         apisValid = false;
      }

      let regex = api.regex || '';

      if (regex.length <= 0) {
         let parts = api.path.split('/');

         let regexTemp = parts.map((part) => {
            return part.length > 0 ? (part.includes(':') ? ':w+' : part) : '';
         });

         regex = regexTemp.join('/');
      }

      return { ...api, regex: new RegExp(regex) };
   });

   if (apisValid) {
      Apis = apisWithRegex;
      IsAyeAyeSetup = true;
   } else {
      Logger(PACKAGE_NAME + apiFailureMessage);
   }

   return Apis;
};

const Handle = (path, method, headers, apis = Apis) => {
   let api =
      apis.find((api) => api.method === method && api.regex.test(path)) || null;

   if (api === null) {
      Logger(PACKAGE_NAME + 'No Endpoint found, please verify setup.');
      return false;
   }

   return api.function(path, method, headers);
};

export default Handle;
