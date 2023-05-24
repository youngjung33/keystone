
import { config, list } from '@keystone-6/core';
import {text, relationship, password, integer, timestamp,image} from '@keystone-6/core/fields';
import {allowAll} from '@keystone-6/core/access'
import { graphql } from '@keystone-6/core';

export default config({ 
    db: {
        provider: 'sqlite',
        url: 'file:./database.sqlite3',
    },
    graphql:{
        debug: process.env.NODE_ENV !== 'production',
        path: '/api/graphql',
    },
    server:{
      port:3030
    },
    lists: {
        User: list({
          fields: {
            user_id: text({validation:{isRequired:true, length:{min:5, max:15,}}, isIndexed: 'unique',label:'사용자 ID'}),
            pw : password({validation:{isRequired:true},label:'패스워드'}),
            name : text({validation:{isRequired:true},label:'이름'}),
            contact : text({validation:{isRequired:true}, isIndexed: 'unique' }),
            company : text({validation:{isRequired:true}}),
            workplace : text({validation:{isRequired:true}}),
            position : text({validation:{isRequired:true}}),
            email : text({validation:{isRequired:true}, isIndexed: 'unique'}),
            nickname : text({validation:{isRequired:true,length:{min:2, max:15,}}, isIndexed: 'unique'}),
            // profilepic : image({storage: 'upload'}),
        
            
            //equipmentRequests: relationship({ ref: 'equipmentRequestInfo.requested_by', many: true }),
          },
          access:allowAll,
        }),
        equipmentRequestInfo: list({
          fields: {            
            request_eq_date: timestamp({ defaultValue:{kind: 'now'}, validation:{isRequired:true}}),
            request_eq_state : text({validation:{isRequired:true}, defaultValue: '신청'}),
            request_eq_address : text({validation:{isRequired:true}}),
            requested_by: 
              relationship({
                ref: 'User',many:false,      
                ui:{
                  labelField:'name'
                }
              }
              ),
              request_items : relationship({ref:'EquipmentRequestItem',many:true, ui:{
                labelField:'requested_count',
              }})
          },
          access:allowAll
        }),

        
        Equipment: list({
          fields: {        
            equipment_name: text({validation:{isRequired:true}, label:'비품이름'}),
            equipment_description : text({validation:{isRequired:true}}),
            equipment_max_quantity : integer({validation:{isRequired:true}}),            
           
          },
          access:allowAll,
          graphql: {
            plural: 'Equipments', // 복수형 이름 지정
          },
        }),
        EquipmentRequestItem: list({
          fields: {
            equipment_item: relationship({ ref: 'Equipment', many: false, ui:{
              labelField:'equipment_name'
            },label:'비품이름'}),          
            requested_count: integer({ validation: { isRequired: true } }),
          },
          access: allowAll,
        }),
      }
});

// keystone.prepare({ dev: process.env.NODE_ENV !== 'production' })
//   .then(async ({ server }) => {
//     await server.start();
//     console.log('Keystone server is running!');
//   })
//   .catch((error) => {
//     console.error('Error starting Keystone:', error);
//     process.exit(1);
//   });