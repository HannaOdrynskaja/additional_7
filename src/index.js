module.exports = function solveSudoku(matrix) {
    Sudoku = function(in_val) {
    var solved = [];
    var steps = 0;

    MakeArray(in_val);
    solve();
    
 //Исходный массив   
    function MakeArray(in_val) {
        steps = 0;
        let suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		for (let i=0; i<9; i++) {
            solved[i] = [];
            for (let j=0; j<9; j++ ) {
                if ( in_val[i][j] ) {
                    solved[i][j] = [in_val[i][j], 'in', []];
                }
                else {
                    solved[i][j] = [0, 'unknown', suggest];
                }
            }
        }
    }; 

//Решение
    function solve() {
        let change = 0;
        do {
            change = updateSuggests();
            steps++;
            if ( 81 < steps ) {
                 break;
            }
        } while (change);

        if ( !isSolved() && !isFailed() ) {
            //поиск с возвратом
            backtracking();
        }
    }; 


// Обновл.список кандидатов     
    function updateSuggests() {
        let change = 0;
        let buf = arrayDiff(solved[1][3][2], rowContent(1));
        buf = arrayDiff(buf, colContent(3));
        buf = arrayDiff(buf, sectContent(1, 3));
        for (let i=0; i<9; i++) {
            for ( let j=0; j<9; j++) {
                if ( 'unknown' != solved[i][j][1] ) {                    
                    continue;
                }                
                change += Single(i, j);                
                change += HiddenSingle(i, j);
            }
        }
        return change;
    }; 

//Одиночка     
    function Single(i, j) {
        solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
        solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
        solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
        if ( 1 == solved[i][j][2].length ) {
            markSolved(i, j, solved[i][j][2][0]);
            return 1;
        }
        return 0;
    }; 

//Скрытый одиночка   
    function HiddenSingle(i, j) {
        var less_suggest = lessRowSuggest(i, j);
        var change = 0;
        if ( 1 == less_suggest.length ) {
            markSolved(i, j, less_suggest[0]);
            change++;
        }
        var less_suggest = lessColSuggest(i, j);
        if ( 1 == less_suggest.length ) {
            markSolved(i, j, less_suggest[0]);
            change++;
        }
        var less_suggest = lessSectSuggest(i, j);
        if ( 1 == less_suggest.length ) {
            markSolved(i, j, less_suggest[0]);
            change++;
        }
        return change;
    }; 
    
 //маркировка решенной ячейки
    function markSolved(i, j, solve) {
        solved[i][j][0] = solve;
        solved[i][j][1] = 'solved';
    }; 

//Элементы строки    
    function rowContent(i) {
        let line = [];
        for ( let j=0; j<9; j++ ) {
            if ( 'unknown' != solved[i][j][1] ) {
                line[line.length] = solved[i][j][0];
            }
        }
        return line;
    }; 

// Элементы столбца
    function colContent(j) {
        var col = [];
        for ( let i=0; i<9; i++ ) {
            if ( 'unknown' != solved[i][j][1] ) {
                col[col.length] = solved[i][j][0];
            }
        }
        return col;
    };

 // секции
    function sectContent(i, j) {
        var content = [];
        var offset = section(i, j);
        for ( let k=0; k<3; k++ ) {
            for ( let l=0; l<3; l++ ) {
                if ( 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                    content[content.length] = solved[offset.i+k][offset.j+l][0];
                }
            }
        }
        return content;
    }; 

//Минимизированное множество предположений по строке
    function lessRowSuggest(i, j) {
        var less_suggest = solved[i][j][2];
        for ( var k=0; k<9; k++ ) {
            if ( k == j || 'unknown' != solved[i][k][1] ) {
                continue;
            }
            less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
        }
        return less_suggest;
    }; 
   
//  по столбцу
    function lessColSuggest(i, j) {
        var less_suggest = solved[i][j][2];
        for ( var k=0; k<9; k++ ) {
            if ( k == i || 'unknown' != solved[k][j][1] ) {
                continue;
            }
            less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
        }
        return less_suggest;
    }; 

//  по секции
    function lessSectSuggest(i, j) {
        var less_suggest = solved[i][j][2];
        var offset = section(i, j);
        for ( var k=0; k<3; k++ ) {
            for ( var l=0; l<3; l++ ) {
                if ( ((offset.i+k) == i  && (offset.j+l) == j)|| 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                    continue;
                }
                less_suggest = arrayDiff(less_suggest, solved[offset.i+k][offset.j+l][2]);
            }
        }
        return less_suggest;
    };

// Вычисление разницы между двумя массивами
    function arrayDiff (ar1, ar2) {
        var arr_diff = [];
        for ( var i=0; i<ar1.length; i++ ) {
            var is_found = false;
            for ( var j=0; j<ar2.length; j++ ) {
                if ( ar1[i] == ar2[j] ) {
                    is_found = true;
                    break;
                }
            }
            if ( !is_found ) {
                arr_diff[arr_diff.length] = ar1[i];
            }
        }
        return arr_diff;
    };

//Уникальные значения массива
    function arrayUnique(ar){
        let sorter = {};
        for(let i=0,j=ar.length;i<j;i++){
        sorter[ar[i]] = ar[i];
        }
        ar = [];
        for(let i in sorter){
        ar.push(i);
        }
        return ar;
    };     

//Расчет секции
    function section(i, j) {
        return {
            j: Math.floor(j/3)*3,
            i: Math.floor(i/3)*3
        };
    };

//итоговая матрица
    this.solution = function() {
        var arr = [[]];
        for ( var i=0; i<9; i++) {
			arr[i]=[];           
            for ( var j=0; j<9; j++ ) {
                arr[i][j]=solved[i][j][0];;
            }
        }        
		console.log(arr);
        return arr;
    }; 

//Проверка
    function isSolved() {
        var is_solved = true;
        for ( var i=0; i<9; i++) {
            for ( var j=0; j<9; j++ ) {
                if ( 'unknown' == solved[i][j][1] ) {
                    is_solved = false;
                }
            }
        }
        return is_solved;
    }; 



this.isSolved = function() {
        return isSolved();
    }; 


    
    function isFailed() {
        var is_failed = false;
        for ( var i=0; i<9; i++) {
            for ( var j=0; j<9; j++ ) {
                if ( 'unknown' == solved[i][j][1] && !solved[i][j][2].length ) {
                    is_failed = true;
                }
            }
        }
        return is_failed;
    }; 
    
    this.isFailed = function() {
        return isFailed();
    }; 

//поиск с возвратом
    function backtracking() {
        // новый массив
        var in_val = [[], [], [], [], [], [], [], [], []];
        var i_min=-1, j_min=-1, suggests_cnt=0;
        for ( var i=0; i<9; i++ ) {
            in_val[i].length = 9;
            for ( var j=0; j<9; j++ ) {
                in_val[i][j] = solved[i][j][0];
                if ( 'unknown' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt) ) {
                    suggests_cnt = solved[i][j][2].length;
                    i_min = i;
                    j_min = j;
                }
            }
        }

        
        for ( var k=0; k<suggests_cnt; k++ ) {
            in_val[i_min][j_min] = solved[i_min][j_min][2][k];       
            var sudoku = new Sudoku(in_val);
            if ( sudoku.isSolved() ) {        
                out_val = sudoku.solved();                
                for ( var i=0; i<9; i++ ) {
                    for ( var j=0; j<9; j++ ) {
                        if ( 'unknown' == solved[i][j][1] ) {
                            markSolved(i, j, out_val[i][j][0])
							
                        }
                    }
                }
                return; 
            }
        }
    }; 


	 
    this.solved = function() {
//		console.log('solved='+solved);
        return solved;
};

}; 

var sudoku = new Sudoku(matrix);
return sudoku.solution();


}; 



