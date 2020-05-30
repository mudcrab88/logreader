class Purchase
{
    constructor(db, doc, file, dir, root)
    {
        this.db = db;
        this.doc = doc;
        this.file = file;
        this.dir = dir;
        this.root = root;
        this.root = root;
        this.docnumber = this.getStrValueByTagName("number");
        this.rid = this.getStrValueByTagName("RID");
        this.obj = this.getStrValueByTagName("object");
        this.purchaseID = this.getStrValueByTagName("purchaseID");
        this.price = this.getNumValueByTagName("price");
        this.customerINN = this.getStrValueByTagName("ns2:inn");
        this.name = this.getStrValueByTagName("ns2:fullName");
        this.facialAccCls = this.getNumValueByTagName("ns2:code");
    }
    getStrValueByTagName(tag)
    {
        let elem = this.doc.getElementsByTagName(tag)[0];
        return ( typeof(elem)=="undefined" ) ? "ERROR" : elem.childNodes[0].nodeValue;
    }
    getNumValueByTagName(tag)
    {
        let elem = this.doc.getElementsByTagName(tag)[0];
        return ( typeof(elem)=="undefined" ) ? 0 : elem.childNodes[0].nodeValue;
    }
    insertRecord()
    {
        this.db.run("INSERT INTO files(name, dir, rootpath, docnumber, rid, purchase_id, object, price, customer_inn, customer_name, facial_acc) VALUES "
        +"($file, $dir, $root, $docnumber, $rid, $obj, $purchaseID, $price, $customerINN, $name, $facialAccCls)",
            {
                $file: this.file,
                $dir: this.dir,
                $root: this.root,
                $docnumber: this.docnumber,
                $rid: this.rid,
                $obj: this.obj,
                $purchaseID: this.purchaseID,
                $price: this.price,
                $customerINN: this.customerINN,
                $name: this.name,
                $facialAccCls: this.facialAccCls,
            }
        );
    }
}
module.exports = Purchase;