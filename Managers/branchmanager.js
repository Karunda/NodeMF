/**
 * Created by Godfrey on 5/23/2016.
 */
var sql = require("mssql");

module.exports = {

    manager: function(req){
        if(req.body.fetchmethod=="branches.fetch"){
            query="SELECT id,name, deleted, code, address, description FROM dbo.Branches";
        }
        else if(req.body.fetchmethod=="branch.add"){
            query='INSERT INTO dbo.Branches'
            query+=' (name, code, address, description)'
            query+=' VALUES ('+req.body.params.name+','+ req.body.params.code+','+
                req.body.params.address+','+ req.body.params.description+') SELECT SCOPE_IDENTITY()';
        }else if(req.body.fetchmethod=="brancheswithvault.fetch"){
            query='SELECT id,name, deleted,code, address,description FROM dbo.Branches';
            query+= ' WHERE id IN (SELECT branch_id FROM Tellers WHERE user_id = 0 AND deleted = 0)';
        }else if(req.body.fetchmethod=="branch.update"){
            query='UPDATE dbo.Branches set name='+req.body.params.name+', code='+req.body.params.code+', description=';
            query+=req.body.params.description+', address='+req.body.params.address+' where id='+req.body.params.id;
        }
        else if(req.body.fetchmethod=="branch.delete"){
            query='UPDATE dbo.Branches set deleted=1  where id='+req.body.params.id;
        }else if(req.body.fetchmethod=="branch.NameExists"){
            query='select count(*)'
            query+=' from dbo.Branches'
            query+=' where name = '+req.body.params.name+' and id<>'+req.body.params.id;
        }else if(req.body.fetchmethod=="branch.CodeExists"){
            query='select count(*)'
            query+=' from dbo.Branches'
            query+=' where code = '+req.body.params.code+' and id<>'+req.body.params.id;
        }
        else if(req.body.fetchmethod=="branch.BranchCodeByClientId"){
            query='SELECT Branches.code FROM Tiers '
            query+=' INNER JOIN Branches ON Branches.id = Tiers.branch_id '
            query+=' WHERE Tiers.id = '+req.body.params.id;
        }
        else if(req.body.fetchmethod=="branch.fetchById"){
            query='SELECT * from Branches '
            query+=' WHERE id = '+req.body.params.id;
        }else if(req.body.fetchmethod=="branch.fetchByName"){
            query="SELECT * from Branches "
            query+=" WHERE name like '%"+req.body.params.name+"%'";
        }

        return {query:query};

    },

    remove: function(msg){

    }
};
