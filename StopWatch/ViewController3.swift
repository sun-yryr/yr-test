//
//  ViewController3.swift
//  StopWatch
//
//  Created by 皆川泰陽 on 2017/02/13.
//  Copyright © 2017年 皆川泰陽. All rights reserved.
//

import UIKit

class ViewController3: UIViewController {
    
    @IBOutlet weak var jikyu: UITextField!
    let ud = UserDefaults.standard
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if ud.object(forKey: "jikyu_key") != nil {
            let setting = ud.object(forKey: "jikyu_key") as! Int
            jikyu.placeholder = String(setting) + "円"
        }else{}
        
        let leftbutton = UIBarButtonItem(title: "保存", style: UIBarButtonItemStyle.plain, target: self, action: #selector(ViewController3.save as (ViewController3) -> () -> ()))
        self.navigationItem.rightBarButtonItem = leftbutton

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func save() {
        if let text :String = jikyu.text,let yen = Int(text){ //jikyuが数値に変換できた時の処理
            ud.set(yen, forKey: "jikyu_key")
            ud.synchronize()
            
            let alert2 = UIAlertController(title: "保存完了", message: "", preferredStyle: .alert)
            alert2.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert2, animated: true, completion: nil)
            
        }else{ //jikyuがnilか数値に変換できなかった時の処理
            let alert = UIAlertController(title: "エラー", message: "数値を入力してください。", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true, completion: nil)
        }
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
