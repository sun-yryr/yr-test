//
//  ViewController2.swift
//  StopWatch
//
//  Created by 皆川泰陽 on 2017/02/12.
//  Copyright © 2017年 皆川泰陽. All rights reserved.
//

import UIKit

class ViewController2: UIViewController {

    @IBOutlet weak var TodayLabel: UILabel!
    @IBOutlet weak var StartLabel: UILabel!
    @IBOutlet weak var FinishLabel: UILabel!
    
    static var money: [Int] = []
    static var start: [String] = []
    static var end: [String] = []
    
    let ud = UserDefaults.standard
    var startTime :TimeInterval?
    var time = 0
    
    @IBAction func StartWork(_ sender: Any) {
        if ud.object(forKey: "jikyu_key") != nil {
            if (StartLabel.text == "") {
                StartLabel.text = TimeString()
                startTime = NSDate.timeIntervalSinceReferenceDate
            }
        }else {
            let alert2 = UIAlertController(title: "", message: ("時給を入力してください。"), preferredStyle: .alert)
            alert2.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert2, animated: true, completion: nil)
            
        }

    }
    
    @IBAction func FinishWork(_ sender: Any) {

        
        
        if (StartLabel.text != "") {
            if (FinishLabel.text == "") {
                FinishLabel.text = TimeString()
                
                var jikyu = ud.object(forKey: "jikyu_key") as! Double
                jikyu = jikyu / 60.0
                let endTime = NSDate.timeIntervalSinceReferenceDate
                let diffTime :TimeInterval = endTime - startTime!
                let minutes = Int(diffTime / 60.0)
                let kyuryou = Int(jikyu * Double(minutes))
                if ud.object(forKey: "money_key") != nil {
                    ViewController2.money = ud.object(forKey: "money_key") as! [Int]
                    ViewController2.start = ud.object(forKey: "start_key") as! [String]
                    ViewController2.end = ud.object(forKey: "end_key") as! [String]
                }
                
                ViewController2.money.append(kyuryou)
                ViewController2.start.append(StartLabel.text!)
                ViewController2.end.append(FinishLabel.text!)
                ud.set(ViewController2.money, forKey: "money_key")
                ud.set(ViewController2.start, forKey: "start_key")
                ud.set(ViewController2.end, forKey: "end_key")
                ud.synchronize()
                print(ViewController2.money)
                print(ViewController2.start)
                print(ViewController2.end)
                
                let alert = UIAlertController(title: "本日の働き", message: ("勤務時間は" + String(minutes) + "分で\n給与は" + String(kyuryou) + "円です。"), preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default))
                self.present(alert, animated: true, completion: nil)
                
            }
        }
    }
    
    
    func DateString() -> String {
        let now = NSDate()
        let formatter = DateFormatter()
        formatter.dateFormat = "MM月dd日"
        return formatter.string(from: now as Date)
    }
    
    func TimeString() -> String {
        let now = NSDate()
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: now as Date)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        TodayLabel.text = "今日は " + DateString()
        StartLabel.text = ""
        FinishLabel.text = ""
        
        

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
