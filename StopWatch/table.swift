//
//  table.swift
//  StopWatch
//
//  Created by 皆川泰陽 on 2017/02/14.
//  Copyright © 2017年 皆川泰陽. All rights reserved.
//

import UIKit

class table: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var myTable: UITableView!
    let ud = UserDefaults.standard
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if ud.object(forKey: "money_key") != nil {
            let money = ud.object(forKey: "money_key") as! [Int]
            return money.count
        }else {
            return 0
        }
        
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if ud.object(forKey: "money_key") != nil {
            let money = ud.object(forKey: "money_key") as! [Int]
            let startTime = ud.object(forKey: "start_key") as! [String]
            let endTime = ud.object(forKey: "end_key") as! [String]
            
            let cell = UITableViewCell(style: UITableViewCellStyle.value1, reuseIdentifier: "Mycell")
            cell.textLabel!.text = String(money[indexPath.row]) + "円"
            cell.detailTextLabel?.text = startTime[indexPath.row] + " - " + endTime[indexPath.row]
            return cell
        }else {
            let cell = UITableViewCell(style: UITableViewCellStyle.value1, reuseIdentifier: "Mycell")
            return cell
        }
        
        
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath)  {
    }
    
    func Delete() { //tableviewのcell削除をここに書きました
        let money = ud.object(forKey: "money_key") as! [Int]
        let Alart = UIAlertController(title: "削除", message: "削除してもよろしいですか？", preferredStyle: .alert)
        Alart.addAction(UIAlertAction(title: "OK", style: .default, handler: { action in
            if self.ud.object(forKey: "money_key") != nil {
                var money = self.ud.object(forKey: "money_key") as! [Int]
                let clear :[String] = []
                money.removeAll()
                self.ud.set(money, forKey: "money_key")
                self.ud.set(clear, forKey: "start_key")
                self.ud.set(clear, forKey: "end_key")
                self.ud.synchronize()
                self.myTable.reloadData()
            }else {
            }
        }))
        Alart.addAction(UIAlertAction(title: "キャンセル", style: .cancel))
        if money.count != 0 {
            self.present(Alart, animated: true, completion: nil)
        }else{}
        return
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let rightbutton = UIBarButtonItem(title: "削除", style: UIBarButtonItemStyle.plain, target: self, action: #selector(table.Delete))
        self.navigationItem.rightBarButtonItem = rightbutton

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
