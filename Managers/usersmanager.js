/**
 * Created by Godfrey on 5/23/2016.
 */
var sql = require("mssql");

module.exports = {

      manager: function(req){
          var queryparams = [];
          if(req.body.fetchmethod=="User.Add"){
              query="INSERT INTO [Users] ([deleted],[role_code],[user_name], [user_pass],   [first_name],  [last_name], [mail],";
              query+="[sex], [phone]) VALUES( @deleted, @roleCode,@username,@userpass, ";
              query+= "@firstname, @lastname,@mail,  @sex, @phone) SELECT SCOPE_IDENTITY()";
              queryparams.push({name:"phone",type:sql.VarChar(250),value:req.body.params.phone});
              queryparams.push({name:"deleted",type:sql.Int,value:req.body.params.deleted});
              queryparams.push({name:"roleCode",type:sql.VarChar(250),value:req.body.params.roleCode});
              queryparams.push({name:"username",type:sql.VarChar(250),value:req.body.params.username});
              queryparams.push({name:"userpass",type:sql.VarChar(250),value:req.body.params.userpass});
              queryparams.push({name:"firstname",type:sql.VarChar(250),value:req.body.params.firstname});
              queryparams.push({name:"lastname",type:sql.VarChar(250),value:req.body.params.lastname});
              queryparams.push({name:"mail",type:sql.VarChar(250),value:req.body.params.mail});
              queryparams.push({name:"sex",type:sql.VarChar(250),value:req.body.params.sex});

          }
          else if(req.body.fetchmethod=="User.Update"){
              query="UPDATE [Users]SET [user_name] = @username,[user_pass] = @userpass,[role_code] = @roleCode,[first_name] = ";
              query+="@firstname,[last_name] = @lastname,[mail] = @mail,[sex] = @sex,[phone] = @phone WHERE [id] = @userId";
              queryparams.push({name:"phone",type:sql.VarChar(250),value:req.body.params.phone});
              queryparams.push({name:"roleCode",type:sql.VarChar(250),value:req.body.params.roleCode});
              queryparams.push({name:"username",type:sql.VarChar(250),value:req.body.params.username});
              queryparams.push({name:"userpass",type:sql.VarChar(250),value:req.body.params.userpass});
              queryparams.push({name:"firstname",type:sql.VarChar(250),value:req.body.params.firstname});
              queryparams.push({name:"lastname",type:sql.VarChar(250),value:req.body.params.lastname});
              queryparams.push({name:"mail",type:sql.VarChar(250),value:req.body.params.mail});
              queryparams.push({name:"sex",type:sql.VarChar(250),value:req.body.params.sex});
              queryparams.push({name:"userId",type:sql.Int,value:req.body.params.userId});

          }else if(req.body.fetchmethod=="User.UpdateExpiry") {
              query="UPDATE [advancedFieldsChecker]SET [expired] = @expired,[timesLoggedIn] = @timesLoggedIn";
              queryparams.push({name:"expired",type:sql.Int,value:req.body.params.expired});
              queryparams.push({name:"timesLoggedIn",type:sql.Int,value:req.body.params.timesLoggedIn});
          }
          else if(req.body.fetchmethod=="User.UserRoleSave"){
              query="INSERT INTO [UserRole]([role_id], [user_id])VALUES(@role_id, @user_id)";
              queryparams.push({name:"role_id",type:sql.Int,value:req.body.params.role_id});
              queryparams.push({name:"user_id",type:sql.Int,value:req.body.params.user_id});
          }
          else if(req.body.fetchmethod=="User.UserRoleUpdate"){
              query="UPDATE [UserRole] SET [role_id] = @role_id WHERE [user_id] = @user_id";
              queryparams.push({name:"role_id",type:sql.Int,value:req.body.params.role_id});
              queryparams.push({name:"user_id",type:sql.Int,value:req.body.params.user_id});
          }else if(req.body.fetchmethod=="User.Delete"){
              query="UPDATE [Users] SET deleted = 1 WHERE [id] = @userId";
              queryparams.push({name:"userId",type:sql.Int,value:req.body.params.userId});
          }
          else if(req.body.fetchmethod=="User.Select"){
              query="SELECT [Users].[id] as user_id,[user_name],[user_pass],[role_code],[first_name],[last_name],[mail],[sex],[phone],";
              query+=" [Users].[deleted],[Roles].[id] as role_id,[Roles].[code] AS role_name,(SELECT COUNT(a.id) FROM ";
              query+=" (SELECT Credit.id, loanofficer_id FROM Credit GROUP BY  Credit.id, loanofficer_id ) a WHERE a.loanofficer_id = Users.id) ";
              query+=" AS contract_count FROM [Users] INNER JOIN UserRole on UserRole.user_id = Users.id ";
              query+=" INNER JOIN Roles ON Roles.id = UserRole.role_id WHERE 1 = 1 AND [Users].[id] = @id";
              queryparams.push({name:"id",type:sql.Int,value:req.body.params.id});
          }
          else if(req.body.fetchmethod=="User.SelectAll"){
              query="SELECT id, deleted, user_name, first_name, last_name, user_pass, mail, sex, phone, (SELECT COUNT(*) " +
                  "FROM dbo.Credit WHERE loanofficer_id = u.id) AS num_contracts FROM dbo.Users AS u";
          }
          else if(req.body.fetchmethod=="User.SelectAllWithoutBranch"){
              query="SELECT u.id, u.deleted, u.user_name, u.first_name, u.last_name, u.user_pass, u.mail, u.sex, u.phone, " +
                  "(SELECT COUNT(*) FROM dbo.Credit WHERE loanofficer_id = u.id) AS num_contracts FROM dbo.Users AS u INNER " +
                  "JOIN dbo.UsersBranches ub ON ub.user_id = u.id INNER JOIN UserRole ur ON ur.user_id = u .id INNER JOIN Roles" +
                  " r ON r.id = ur.role_id WHERE u.deleted = 0 AND r.role_of_teller = 1 AND (u.id NOT IN (SELECT user_id FROM " +
                  "Tellers WHERE deleted = 0) OR u.id = @user_id) AND ub.branch_id = @branch_id AND u.id IN (SELECT @boss_id" +
                  " UNION ALL SELECT subordinate_id FROM dbo.UsersSubordinates WHERE user_id = @boss_id)";
              queryparams.push({name:"user_id",type:sql.Int,value:req.body.params.user_id});
              queryparams.push({name:"boss_id",type:sql.Int,value:req.body.params.boss_id});
              queryparams.push({name:"branch_id",type:sql.Int,value:req.body.params.branch_id});
          }else if(req.body.fetchmethod=="User.SelectSubortinateRel"){
              query="SELECT user_id, subordinate_id FROM dbo.UsersSubordinates ORDER BY user_id";
          }else if(req.body.fetchmethod=="User.SelectBranchRel"){
              query="SELECT user_id, branch_id FROM dbo.UsersBranches ORDER BY user_id";
          }
          else if(req.body.fetchmethod=="User.GetExpiryDetails"){
              query="SELECT expiryDate, expired, FROM dbo.advancedFieldsChecker";
          }
          else if(req.body.fetchmethod=="User.GetExpiryDate"){
              query="SELECT expiryDate, expired,timesLoggedIn FROM dbo.advancedFieldsChecker";
          }
          else if(req.body.fetchmethod=="User.SaveSubordinates"){
              query="DELETE FROM dbo.UsersSubordinates WHERE user_id = @id;" +
                  " INSERT INTO dbo.UsersSubordinates (user_id, subordinate_id) SELECT @id, number  FROM dbo.IntListToTable(@list)";
              queryparams.push({name:"id",type:sql.Int,value:req.body.params.id});
              queryparams.push({name:"list",type:sql.Int,value:req.body.params.list});
          }
          else if(req.body.fetchmethod=="User.SaveBranches"){
              query="DELETE FROM dbo.UsersBranches WHERE user_id = @id;" +
                  " INSERT INTO dbo.UsersBranches (user_id, branch_id) SELECT @id, number  FROM dbo.IntListToTable(@list)";
              queryparams.push({name:"id",type:sql.Int,value:req.body.params.id});
              queryparams.push({name:"list",type:sql.Int,value:req.body.params.list});
          }
          else if(req.body.fetchmethod=="User.GetSubordinates"){
              query="select * from dbo.GetSubordinates(@id)" ;
              queryparams.push({name:"id",type:sql.Int,value:req.body.params.id});
          }
          else if(req.body.fetchmethod=="User.SelectLogin"){
              query="select * FROM dbo.Users where user_name=@username AND user_pass=@password" ;
              queryparams.push({name:"username",type:sql.VarChar(250),value:req.body.params.username},
                  {name:"password",type:sql.VarChar(250),value:req.body.params.password});
          }
          return {query:query,parameters:queryparams};
    },

    remove: function(msg){

    }
};
